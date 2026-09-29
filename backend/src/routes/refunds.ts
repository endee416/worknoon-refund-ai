import { Router } from "express";
import {
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";
import { z } from "zod";

import { db } from "../firebase.js";
import { evaluateRefund } from "../services/refundPolicy.js";
import { generateRefundAnalysis } from "../services/aiService.js";

const router = Router();

const refundSchema = z.object({
  orderNumber: z.string().trim().min(1).max(50),
  message: z.string().trim().min(5).max(2000),
});

router.post("/", async (req, res) => {
  try {
    // ------------------------------------------------
    // 1. Validate request
    // ------------------------------------------------

    const parsed = refundSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: parsed.error.flatten(),
      });
    }

    const { orderNumber, message } = parsed.data;

    // ------------------------------------------------
    // 2. Fetch order
    // ------------------------------------------------

    const orderRef = db.collection("orders").doc(orderNumber);

    const orderSnapshot = await orderRef.get();

    if (!orderSnapshot.exists) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    const order = orderSnapshot.data();

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // ------------------------------------------------
    // 3. Fetch customer
    // ------------------------------------------------

    const customerSnapshot = await db
      .collection("customers")
      .doc(order.customerId)
      .get();

    if (!customerSnapshot.exists) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    const customer = customerSnapshot.data();

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    // ------------------------------------------------
    // 4. Deterministic refund policy
    //
    // THIS decides the actual outcome.
    // The AI does not.
    // ------------------------------------------------

    const policyResult = evaluateRefund({
      finalSale: order.finalSale,
      amount: order.amount,
      refunded: order.refunded,
      purchasedAt: order.purchasedAt.toDate(),
      requestMessage: message,
    });

    // ------------------------------------------------
    // 5. AI assistance
    //
    // AI explains/classifies the authoritative result.
    // ------------------------------------------------

    const aiResult = await generateRefundAnalysis({
      message,

      customer: {
        name: customer.name,
      },

      order: {
        orderNumber,
        productName: order.productName,
        amount: order.amount,
        finalSale: order.finalSale,
        refunded: order.refunded,
        purchasedAt: order.purchasedAt.toDate(),
      },

      policy: policyResult,
    });

    // ------------------------------------------------
    // 6. Save audit record
    // ------------------------------------------------

    const refundRequest = {
      orderNumber,
      orderId: orderNumber,

      customerId: order.customerId,
      customerName: customer.name,
      customerEmail: customer.email,

      productName: order.productName,
      amount: order.amount,

      message,

      decision: policyResult.decision,
      policyReason: policyResult.reason,

      aiCategory: aiResult.category,
      aiSummary: aiResult.summary,
      customerResponse: aiResult.customerResponse,
      auditNote: aiResult.auditNote,
      aiUsed: aiResult.aiUsed,

      createdAt: Timestamp.now(),
    };

    const refundRef = await db
      .collection("refundRequests")
      .add(refundRequest);

    // ------------------------------------------------
    // 7. Return result
    // ------------------------------------------------

    return res.status(201).json({
      id: refundRef.id,

      decision: policyResult.decision,
      reason: policyResult.reason,

      response: aiResult.customerResponse,

      ai: {
        category: aiResult.category,
        summary: aiResult.summary,
        used: aiResult.aiUsed,
      },

      order: {
        orderNumber,
        productName: order.productName,
        amount: order.amount,
      },

      customer: {
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error("Refund error:", error);

    return res.status(500).json({
      error: "Failed to process refund request",
    });
  }
});

// ------------------------------------------------
// Admin dashboard endpoint
// ------------------------------------------------

router.get("/", async (_req, res) => {
  try {
    const snapshot = await db
      .collection("refundRequests")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

const requests = snapshot.docs.map(
  (doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })
);

    return res.json(requests);
  } catch (error) {
    console.error("Failed to fetch refunds:", error);

    return res.status(500).json({
      error: "Failed to fetch refund requests",
    });
  }
});

export default router;