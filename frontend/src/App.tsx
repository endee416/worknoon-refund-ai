import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

type RefundResult = {
  id: string;
  decision: "APPROVED" | "DENIED" | "ESCALATED";
  reason: string;
  response: string;

  ai: {
    category: string;
    summary: string;
    used: boolean;
  };

  order: {
    orderNumber: string;
    productName: string;
    amount: number;
  };

  customer: {
    name: string;
    email: string;
  };
};

type FirestoreTimestamp = {
  _seconds?: number;
  seconds?: number;
};

type RefundRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  productName: string;
  amount: number;
  message: string;

  decision: "APPROVED" | "DENIED" | "ESCALATED";
  policyReason: string;

  aiCategory?: string;
  aiSummary?: string;
  auditNote?: string;
  aiUsed?: boolean;

  createdAt?: FirestoreTimestamp;
};

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

function App() {
  const [tab, setTab] =
    useState<"customer" | "admin">("customer");

  const [orderNumber, setOrderNumber] =
    useState("ORD-1001");

  const [message, setMessage] = useState("");

  const [result, setResult] =
    useState<RefundResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [requests, setRequests] = useState<
    RefundRecord[]
  >([]);

  const [dashboardLoading, setDashboardLoading] =
    useState(false);

  async function submitRefund(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response =
        await axios.post<RefundResult>(
          `${API}/api/refunds`,
          {
            orderNumber: orderNumber.trim(),
            message: message.trim(),
          }
        );

      setResult(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong while processing your request."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadRequests() {
    setDashboardLoading(true);

    try {
      const response =
        await axios.get<RefundRecord[]>(
          `${API}/api/refunds`
        );

      setRequests(response.data);
    } catch (error) {
      console.error(
        "Failed to load refund requests:",
        error
      );
    } finally {
      setDashboardLoading(false);
    }
  }

  function formatTimestamp(
    timestamp?: FirestoreTimestamp
  ) {
    if (!timestamp) {
      return "—";
    }

    const seconds =
      timestamp._seconds ??
      timestamp.seconds;

    if (!seconds) {
      return "—";
    }

    return new Date(
      seconds * 1000
    ).toLocaleString();
  }

  useEffect(() => {
    if (tab === "admin") {
      loadRequests();
    }
  }, [tab]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>RefundAI</h1>

          <p>
            AI-assisted customer support refund
            processing
          </p>
        </div>

        <div className="status">
          <span className="dot" />
          System online
        </div>
      </header>

      <nav className="tabs">
        <button
          className={
            tab === "customer" ? "active" : ""
          }
          onClick={() =>
            setTab("customer")
          }
        >
          Customer Request
        </button>

        <button
          className={
            tab === "admin" ? "active" : ""
          }
          onClick={() => setTab("admin")}
        >
          Support Dashboard
        </button>
      </nav>

      <main>
        {tab === "customer" ? (
          <section className="customer-layout">
            <div className="card">
              <h2>Request a Refund</h2>

              <p className="muted">
                Enter your order number and tell
                us what went wrong.
              </p>

              <form onSubmit={submitRefund}>
                <label>
                  Order Number
                </label>

                <input
                  value={orderNumber}
                  onChange={(e) =>
                    setOrderNumber(
                      e.target.value
                    )
                  }
                  placeholder="ORD-1001"
                  required
                />

                <label>
                  What happened?
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Tell us why you are requesting a refund..."
                  rows={6}
                  required
                />

                <button
                  className="primary"
                  disabled={loading}
                  type="submit"
                >
                  {loading
                    ? "Reviewing request..."
                    : "Submit Refund Request"}
                </button>
              </form>

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}
            </div>

            <div className="card result-card">
              {!result ? (
                <div className="empty-result">
                  <div className="robot">
                    AI
                  </div>

                  <h3>
                    Refund Assistant
                  </h3>

                  <p>
                    Submit a request to
                    receive an AI-assisted
                    policy decision.
                  </p>
                </div>
              ) : (
                <>
                  <div className="result-heading">
                    <span
                      className={`decision ${result.decision.toLowerCase()}`}
                    >
                      {result.decision}
                    </span>

                    {result.ai.used ? (
                      <span className="ai-badge">
                        AI Assisted
                      </span>
                    ) : (
                      <span className="fallback-badge">
                        Policy Engine Only
                      </span>
                    )}
                  </div>

                  <h2>
                    {
                      result.order
                        .productName
                    }
                  </h2>

                  <p className="order-meta">
                    {
                      result.order
                        .orderNumber
                    }{" "}
                    · $
                    {result.order.amount.toFixed(
                      2
                    )}
                  </p>

                  <div className="response-box">
                    <strong>
                      Response
                    </strong>

                    <p>
                      {result.response}
                    </p>
                  </div>

                  {!result.ai.used && (
                    <div className="fallback-notice">
                      AI assistance is
                      currently unavailable.
                      This result was generated
                      using the deterministic
                      refund policy engine.
                    </div>
                  )}

                  <div className="details">
                    <div>
                      <span>
                        Policy reason
                      </span>

                      <p>
                        {result.reason}
                      </p>
                    </div>

                    <div>
                      <span>
                        Processing mode
                      </span>

                      <p>
                        {result.ai.used
                          ? "Policy engine + AI assistance"
                          : "Deterministic policy engine"}
                      </p>
                    </div>

                    {result.ai.used && (
                      <>
                        <div>
                          <span>
                            AI classification
                          </span>

                          <p>
                            {
                              result.ai
                                .category
                            }
                          </p>
                        </div>

                        <div>
                          <span>
                            AI summary
                          </span>

                          <p>
                            {
                              result.ai
                                .summary
                            }
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          <section>
            <div className="dashboard-header">
              <div>
                <h2>
                  Support Dashboard
                </h2>

                <p className="muted">
                  Recent refund
                  decisions, reasoning
                  and audit information.
                </p>
              </div>

              <button
                className="secondary"
                onClick={loadRequests}
                disabled={
                  dashboardLoading
                }
              >
                {dashboardLoading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </div>

            <div className="table-card">
              {dashboardLoading &&
              requests.length === 0 ? (
                <p className="table-message">
                  Loading refund
                  requests...
                </p>
              ) : requests.length ===
                0 ? (
                <p className="table-message">
                  No refund requests
                  yet.
                </p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Decision</th>
                      <th>
                        AI Category
                      </th>
                      <th>Mode</th>
                      <th>Created</th>
                      <th>
                        Audit Note
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map(
                      (request) => (
                        <tr
                          key={
                            request.id
                          }
                        >
                          <td>
                            {
                              request.orderNumber
                            }
                          </td>

                          <td>
                            {
                              request.customerName
                            }
                          </td>

                          <td>
                            {
                              request.productName
                            }
                          </td>

                          <td>
                            $
                            {typeof request.amount ===
                            "number"
                              ? request.amount.toFixed(
                                  2
                                )
                              : "0.00"}
                          </td>

                          <td>
                            <span
                              className={`decision small ${request.decision?.toLowerCase()}`}
                            >
                              {
                                request.decision
                              }
                            </span>
                          </td>

                          <td>
                            {request.aiUsed
                              ? request.aiCategory ||
                                "—"
                              : "—"}
                          </td>

                          <td>
                            {request.aiUsed ? (
                              <span className="ai-badge small-badge">
                                AI
                              </span>
                            ) : (
                              <span className="fallback-badge small-badge">
                                Policy
                              </span>
                            )}
                          </td>

                          <td className="timestamp">
                            {formatTimestamp(
                              request.createdAt
                            )}
                          </td>

                          <td className="audit">
                            {request.auditNote ||
                              request.policyReason}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;