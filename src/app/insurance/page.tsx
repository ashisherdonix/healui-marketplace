import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Shield, CheckCircle, FileText, Phone, CreditCard, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Insurance Coverage | Healui - Physiotherapy Insurance Claims",
  description: "Healui works with major insurance providers for physiotherapy coverage. Get cashless treatment and reimbursement support for your physiotherapy sessions.",
  keywords: "physiotherapy insurance, cashless physiotherapy, insurance claims, reimbursement, health insurance coverage"
};

export default function InsurancePage() {
  const insurancePartners = [
    "Star Health Insurance",
    "HDFC ERGO",
    "ICICI Lombard", 
    "Bajaj Allianz",
    "New India Assurance",
    "Oriental Insurance",
    "United India Insurance",
    "National Insurance",
    "IFFCO Tokio",
    "Future Generali",
    "Cholamandalam MS",
    "Religare Health"
  ];

  const claimProcess = [
    {
      step: "1",
      title: "Verify Coverage",
      description: "Check your insurance policy for physiotherapy coverage before booking"
    },
    {
      step: "2",
      title: "Book Session",
      description: "Inform us about your insurance during booking to arrange cashless treatment"
    },
    {
      step: "3",
      title: "Pre-Authorization",
      description: "We handle pre-authorization with your insurance company if required"
    },
    {
      step: "4",
      title: "Receive Treatment",
      description: "Get your physiotherapy session without upfront payment (cashless)"
    },
    {
      step: "5",
      title: "Documentation",
      description: "We provide all necessary documents for direct billing or reimbursement"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Cashless Treatment",
      description: "No upfront payment required with approved insurance providers"
    },
    {
      icon: FileText,
      title: "Documentation Support",
      description: "Complete paperwork assistance for insurance claims"
    },
    {
      icon: Users,
      title: "TPA Coordination", 
      description: "Direct coordination with Third Party Administrators"
    },
    {
      icon: Phone,
      title: "Claim Support",
      description: "Dedicated support for insurance claim queries and assistance"
    }
  ];

  const requiredDocuments = [
    "Valid insurance policy",
    "Insurance ID card",
    "Government-issued photo ID",
    "Doctor's prescription (if required)",
    "Previous medical reports (if applicable)",
    "Pre-authorization letter (for cashless)"
  ];

  const coverageTypes = [
    {
      type: "Individual Health Insurance",
      coverage: "Covers physiotherapy as part of treatment for covered conditions",
      notes: "Usually requires doctor's prescription and medical necessity"
    },
    {
      type: "Corporate Group Insurance", 
      coverage: "Employee group policies often include physiotherapy benefits",
      notes: "Check with your HR department for specific coverage details"
    },
    {
      type: "Family Floater Policies",
      coverage: "Covers physiotherapy for all family members under the policy",
      notes: "Shared sum insured across all family members"
    },
    {
      type: "Critical Illness Insurance",
      coverage: "May cover physiotherapy as part of recovery treatment",
      notes: "Coverage depends on the specific critical illness diagnosed"
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
              Insurance Coverage for Physiotherapy
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Get cashless treatment with your health insurance. We work with major insurers for your convenience.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Insurance Benefits with Healui
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem"
            }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{
                  backgroundColor: "#ffffff",
                  padding: "2rem",
                  borderRadius: "1rem",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  <benefit.icon style={{ 
                    width: "3rem", 
                    height: "3rem", 
                    color: "#1e5f79",
                    margin: "0 auto 1rem"
                  }} />
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    marginBottom: "0.5rem",
                    color: "#000000"
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{ color: "#666666" }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Partners */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Our Insurance Partners
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem"
            }}>
              {insurancePartners.map((partner, index) => (
                <div key={index} style={{
                  padding: "1rem",
                  backgroundColor: "#c8eaeb",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <Shield style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "500" }}>{partner}</span>
                </div>
              ))}
            </div>
            <p style={{ 
              textAlign: "center",
              marginTop: "2rem",
              color: "#666666",
              fontSize: "1rem"
            }}>
              *Don't see your insurer? Contact us to check coverage options.
            </p>
          </div>
        </section>

        {/* Claim Process */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Simple Insurance Claim Process
            </h2>
            <div style={{ display: "grid", gap: "2rem" }}>
              {claimProcess.map((step, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem"
                }}>
                  <div style={{
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "#1e5f79",
                    color: "#ffffff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    flexShrink: 0
                  }}>
                    {step.step}
                  </div>
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    flex: 1
                  }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                      {step.title}
                    </h3>
                    <p style={{ color: "#666666" }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Types */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Types of Insurance Coverage
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {coverageTypes.map((coverage, index) => (
                <div key={index} style={{
                  padding: "1.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid #1e5f79"
                }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                    {coverage.type}
                  </h3>
                  <p style={{ color: "#666666", marginBottom: "0.5rem" }}>
                    {coverage.coverage}
                  </p>
                  <p style={{ color: "#1e5f79", fontSize: "0.95rem", fontStyle: "italic" }}>
                    Note: {coverage.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Required Documents */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Required Documents
            </h2>
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
            }}>
              <div style={{ 
                display: "grid", 
                gap: "1rem"
              }}>
                {requiredDocuments.map((doc, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <CheckCircle style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "#1e5f79"
                    }} />
                    <span style={{
                      color: "#666666",
                      fontSize: "1rem"
                    }}>
                      {doc}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "#eff8ff",
                borderRadius: "0.5rem",
                border: "1px solid #c8eaeb"
              }}>
                <p style={{
                  color: "#1e5f79",
                  fontSize: "0.95rem",
                  margin: 0
                }}>
                  💡 Tip: Keep digital copies of all documents on your phone for quick access during booking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Insurance */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#000000"
            }}>
              Need Help with Insurance?
            </h2>
            <p style={{ 
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "2rem"
            }}>
              Our insurance team is here to help you understand your coverage and process claims
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
                  Call Insurance Team
                </button>
              </a>
              <a href="mailto:insurance@healui.com">
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
                  Email Insurance Support
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          padding: "4rem 0",
          backgroundColor: "#c8eaeb",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#000000" }}>
              Ready to Use Your Insurance?
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Book your physiotherapy session and let us handle the insurance paperwork
            </p>
            <Link href="/">
              <button style={{
                padding: "1rem 2rem",
                backgroundColor: "#1e5f79",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.125rem",
                fontWeight: "600",
                cursor: "pointer"
              }}>
                Book with Insurance
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}