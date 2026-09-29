import "dotenv/config";
import express from "express";
import cors from "cors";

import { db } from "./firebase.js";
import refundRoutes from "./routes/refunds.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Worknoon Refund API",
  });
});

app.get("/health", async (_req, res) => {
  try {
    const snapshot = await db.collection("customers").get();

    res.json({
      status: "ok",
      database: "connected",
      customers: snapshot.size,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/refunds", refundRoutes);

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});