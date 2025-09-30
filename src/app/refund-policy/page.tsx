import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | Healui - Cancellation and Refund Terms",
  description: "Healui's refund policy: Full refund for cancellations made 2+ hours before appointment. Clear terms for cancellations, no-shows, and refund processing.",
  keywords: "healui refund policy, cancellation policy, physiotherapy refund, booking cancellation, refund terms"
};

export default function RefundPolicyPage() {
  const refundScenarios = [
    {
      icon: CheckCircle,
      title: "Full Refund (100%)",
      conditions: [
        "Cancellation made 2+ hours before appointment",
        "Physiotherapist cancels the appointment", 
        "Service not provided due to our fault",
        "Technical issues prevent service delivery"
      ],
      processing: "Refunded within 5-7 business days"
    },
    {
      icon: AlertTriangle,
      title: "Partial Refund (50%)",
      conditions: [
        "Cancellation made 30 minutes to 2 hours before appointment",
        "Medical emergency (with valid documentation)",
        "Severe weather conditions preventing service"
      ],
      processing: "Refunded within 5-7 business days"
    },
    {
      icon: XCircle,
      title: "No Refund (0%)",
      conditions: [
        "Cancellation made less than 30 minutes before appointment",
        "No-show without prior notification",
        "Patient refuses service after physiotherapist arrives",
        "Incomplete or false information provided during booking"
      ],
      processing: "No refund applicable"
    }
  ];

  const refundMethods = [
    {
      method: "Original Payment Method",
      timeline: "5-7 business days",
      details: "Refund credited back to the card/UPI used for payment"
    },
    {
      method: "Bank Transfer",
      timeline: "3-5 business days", 
      details: "Direct transfer to your bank account (for cash payments)"
    },
    {
      method: "Healui Credits",
      timeline: "Instant",
      details: "Credits added to your Healui wallet for future bookings"
    }
  ];

  const specialCases = [
    {
      case: "Package Bookings",
      policy: "Unused sessions from packages can be refunded based on individual session cancellation policy"
    },
    {
      case: "Insurance Claims",
      policy: "Refunds for insurance-covered sessions follow insurance provider guidelines"
    },
    {
      case: "Corporate Bookings",
      policy: "Corporate accounts may have different refund terms as per agreement"
    },
    {
      case: "Emergency Services",
      policy: "Emergency booking fees are non-refundable once service is confirmed"
    }
  ];

  return (
    <>
      <Header />
      <div style={{ backgroundColor: "#eff8ff", minHeight: "100vh" }}>
        {/* Hero Section */}
        <section style={{ 
          backgroundColor: "#1e5f79",
          color: "#ffffff",
          padding: "4rem 0",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "700" }}>
              Refund Policy
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Clear and fair refund terms for all Healui services
            </p>
          </div>
        </section>

        {/* Key Policy Highlight */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              border: "2px solid #c8eaeb",
              textAlign: "center"
            }}>
              <Clock style={{
                width: "3rem",
                height: "3rem",
                color: "#1e5f79",
                margin: "0 auto 1rem"
              }} />
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#000000"
              }}>
                2-Hour Cancellation Policy
              </h2>
              <p style={{
                fontSize: "1.125rem",
                color: "#666666",
                lineHeight: "1.6"
              }}>
                <strong style={{ color: "#1e5f79" }}>Full refund guaranteed</strong> for all cancellations 
                made 2 or more hours before your scheduled appointment time. This policy ensures fair 
                treatment for both patients and physiotherapists.
              </p>
            </div>
          </div>
        </section>

        {/* Refund Scenarios */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Refund Scenarios
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem"
            }}>
              {refundScenarios.map((scenario, index) => (
                <div key={index} style={{
                  backgroundColor: "#f8f9fa",
                  padding: "2rem",
                  borderRadius: "1rem",
                  border: "2px solid #e9ecef"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <scenario.icon style={{
                      width: "2rem",
                      height: "2rem",
                      color: scenario.icon === CheckCircle ? "#22c55e" : 
                             scenario.icon === AlertTriangle ? "#f59e0b" : "#ef4444"
                    }} />
                    <h3 style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#000000"
                    }}>
                      {scenario.title}
                    </h3>
                  </div>
                  
                  <h4 style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "#000000"
                  }}>
                    Conditions:
                  </h4>
                  <ul style={{
                    listStyle: "none",
                    padding: 0,
                    marginBottom: "1rem"
                  }}>
                    {scenario.conditions.map((condition, condIndex) => (
                      <li key={condIndex} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                        color: "#666666",
                        fontSize: "0.95rem"
                      }}>
                        <span style={{ 
                          width: "4px", 
                          height: "4px", 
                          backgroundColor: "#1e5f79",
                          borderRadius: "50%",
                          marginTop: "0.5rem",
                          flexShrink: 0
                        }}></span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                  
                  <div style={{
                    backgroundColor: "#eff8ff",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #c8eaeb"
                  }}>
                    <strong style={{ color: "#1e5f79", fontSize: "0.95rem" }}>
                      Processing: {scenario.processing}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Methods */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Refund Methods & Timeline
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {refundMethods.map((method, index) => (
                <div key={index} style={{
                  backgroundColor: "#ffffff",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                      color: "#000000"
                    }}>
                      {method.method}
                    </h3>
                    <p style={{
                      color: "#666666",
                      fontSize: "0.95rem"
                    }}>
                      {method.details}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#c8eaeb",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1e5f79"
                  }}>
                    {method.timeline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Cases */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Special Cases
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {specialCases.map((item, index) => (
                <div key={index} style={{
                  padding: "1.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid #1e5f79"
                }}>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#000000"
                  }}>
                    {item.case}
                  </h3>
                  <p style={{
                    color: "#666666",
                    fontSize: "0.95rem"
                  }}>
                    {item.policy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Request Refund */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              How to Request a Refund
            </h2>
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {[
                  { step: "1", title: "Cancel Your Booking", desc: "Use the app, website, or call our support team to cancel" },
                  { step: "2", title: "Provide Details", desc: "Share your booking ID and reason for cancellation" },
                  { step: "3", title: "Automatic Processing", desc: "Eligible refunds are processed automatically based on timing" },
                  { step: "4", title: "Receive Confirmation", desc: "Get SMS/email confirmation with refund details and timeline" }
                ].map((step, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem"
                  }}>
                    <div style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#1e5f79",
                      color: "#ffffff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      flexShrink: 0
                    }}>
                      {step.step}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.125rem", marginBottom: "0.25rem", color: "#000000" }}>
                        {step.title}
                      </h3>
                      <p style={{ color: "#666666", fontSize: "0.95rem" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#000000"
            }}>
              Need Help with Refunds?
            </h2>
            <p style={{ 
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "2rem"
            }}>
              Contact our support team for assistance with refunds and cancellations
            </p>
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <a href="tel:+911800HEALUI">
                <button style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#1e5f79",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <Phone style={{ width: "1rem", height: "1rem" }} />
                  Call Support
                </button>
              </a>
              <a href="mailto:refunds@healui.com">
                <button style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "transparent",
                  color: "#1e5f79",
                  border: "2px solid #1e5f79",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  Email Refunds Team
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section style={{ padding: "2rem 0", backgroundColor: "#f8f9fa" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <p style={{
              color: "#666666",
              fontSize: "0.875rem"
            }}>
              This refund policy was last updated on {new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}. 
              Healui reserves the right to modify this policy with advance notice.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}