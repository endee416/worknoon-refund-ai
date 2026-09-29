export type RefundDecision = "APPROVED" | "DENIED" | "ESCALATED";

export interface RefundPolicyInput {
  finalSale: boolean;
  amount: number;
  purchasedAt: Date;
  refunded: boolean;
  requestMessage: string;
}

export interface RefundPolicyResult {
  decision: RefundDecision;
  reason: string;
}

export function evaluateRefund(
  input: RefundPolicyInput
): RefundPolicyResult {
  const {
    finalSale,
    amount,
    purchasedAt,
    refunded,
    requestMessage,
  } = input;

  if (refunded) {
    return {
      decision: "DENIED",
      reason: "This order has already been refunded.",
    };
  }

  if (finalSale) {
    return {
      decision: "DENIED",
      reason: "Final sale items are not eligible for refunds.",
    };
  }

  const ageMs = Date.now() - purchasedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays > 30) {
    return {
      decision: "DENIED",
      reason: "The order is outside the 30-day refund window.",
    };
  }

  if (amount > 500) {
    return {
      decision: "ESCALATED",
      reason: "Refunds above $500 require human review.",
    };
  }

  const suspiciousPatterns = [
    /ignore.*policy/i,
    /override.*policy/i,
    /bypass/i,
    /system prompt/i,
    /developer message/i,
    /approve.*regardless/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(requestMessage))) {
    return {
      decision: "ESCALATED",
      reason:
        "The request contains suspicious instructions and requires human review.",
    };
  }

  const eligibleReason =
    /\b(damaged|broken|defective|incorrect|wrong item|wrong product|not what i ordered)\b/i;

  if (eligibleReason.test(requestMessage)) {
    return {
      decision: "APPROVED",
      reason:
        "The customer reported a damaged, defective, or incorrect item within the refund window.",
    };
  }

  return {
    decision: "ESCALATED",
    reason:
      "The request does not match an automatic approval or denial rule and requires human review.",
  };
}