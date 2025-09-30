import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Check, Star, Clock, Home, Video, Users, Shield, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | Healui - Transparent Physiotherapy Pricing",
  description: "Clear, transparent pricing for physiotherapy services. Home visits starting from ₹800, online consultations from ₹400. No hidden charges.",
  keywords: "physiotherapy pricing, physiotherapy cost, home visit price, online consultation price, healui pricing"
};

export default function PricingPage() {
  const services = [
    {
      title: "Online Consultation",
      icon: Video,
      price: "₹400",
      duration: "30-45 minutes",
      description: "Video consultation with certified physiotherapist",
      features: [
        "HD video consultation",
        "Exercise program guidance",
        "Posture assessment",
        "Pain management advice",
        "Follow-up recommendations",
        "Digital prescription"
      ],
      popular: false
    },
    {
      title: "Home Visit",
      icon: Home,
      price: "₹800",
      duration: "45-60 minutes", 
      description: "Physiotherapist visits your home with equipment",
      features: [
        "In-person assessment",
        "Hands-on treatment",
        "Professional equipment",
        "Personalized exercise plan",
        "Family education",
        "Progress tracking"
      ],
      popular: true
    },
    {
      title: "Package of 5 Sessions",
      icon: Calendar,
      price: "₹3,500",
      originalPrice: "₹4,000",
      duration: "5 home visits",
      description: "Save ₹500 with our 5-session package",
      features: [
        "5 home visit sessions",
        "Consistent therapist",
        "Progress monitoring",
        "Customized treatment plan",
        "Family training included",
        "12% savings"
      ],
      popular: false
    }
  ];

  const additionalServices = [
    {
      service: "Weekend/Holiday Sessions",
      price: "+₹100",
      description: "Additional charge for weekend or holiday appointments"
    },
    {
      service: "Emergency/Same Day",
      price: "+₹200", 
      description: "Priority booking for urgent care needs"
    },
    {
      service: "Extended Session (90 min)",
      price: "+₹300",
      description: "Longer sessions for complex conditions"
    },
    {
      service: "Group Session (2-3 people)",
      price: "₹600 per person",
      description: "Discounted rate for family members or groups"
    }
  ];

  const included = [
    "Initial assessment and evaluation",
    "Personalized treatment plan",
    "Home exercise program",
    "Progress tracking and reports",
    "Family/caregiver education",
    "Follow-up recommendations"
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
              Transparent Pricing
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              No hidden charges. Pay only for the care you receive.
            </p>
          </div>
        </section>

        {/* Main Pricing Cards */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem"
            }}>
              {services.map((service, index) => (
                <div key={index} style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "1rem",
                  padding: "2rem",
                  boxShadow: service.popular 
                    ? "0 8px 32px rgba(30, 95, 121, 0.15)" 
                    : "0 4px 16px rgba(0,0,0,0.1)",
                  border: service.popular ? "2px solid #1e5f79" : "1px solid #e5e7eb",
                  position: "relative",
                  textAlign: "center"
                }}>
                  {service.popular && (
                    <div style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#1e5f79",
                      color: "#ffffff",
                      padding: "0.5rem 1.5rem",
                      borderRadius: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "600"
                    }}>
                      Most Popular
                    </div>
                  )}

                  <service.icon style={{
                    width: "3rem",
                    height: "3rem",
                    color: "#1e5f79",
                    margin: "0 auto 1rem"
                  }} />

                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "#000000"
                  }}>
                    {service.title}
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{
                      fontSize: "2.5rem",
                      fontWeight: "700",
                      color: "#1e5f79",
                      lineHeight: "1"
                    }}>
                      {service.price}
                    </div>
                    {service.originalPrice && (
                      <div style={{
                        fontSize: "1.125rem",
                        color: "#9ca3af",
                        textDecoration: "line-through"
                      }}>
                        {service.originalPrice}
                      </div>
                    )}
                    <div style={{
                      fontSize: "0.875rem",
                      color: "#666666",
                      marginTop: "0.25rem"
                    }}>
                      {service.duration}
                    </div>
                  </div>

                  <p style={{
                    color: "#666666",
                    marginBottom: "2rem"
                  }}>
                    {service.description}
                  </p>

                  <ul style={{
                    listStyle: "none",
                    padding: 0,
                    textAlign: "left",
                    marginBottom: "2rem"
                  }}>
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.75rem"
                      }}>
                        <Check style={{
                          width: "1rem",
                          height: "1rem",
                          color: "#1e5f79"
                        }} />
                        <span style={{ color: "#666666", fontSize: "0.95rem" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/">
                    <button style={{
                      width: "100%",
                      padding: "0.875rem",
                      backgroundColor: service.popular ? "#1e5f79" : "transparent",
                      color: service.popular ? "#ffffff" : "#1e5f79",
                      border: service.popular ? "none" : "2px solid #1e5f79",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}>
                      Book Now
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Additional Services
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {additionalServices.map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.75rem",
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
                      {item.service}
                    </h3>
                    <p style={{
                      color: "#666666",
                      fontSize: "0.95rem"
                    }}>
                      {item.description}
                    </p>
                  </div>
                  <div style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#1e5f79"
                  }}>
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              What's Included in Every Session
            </h2>
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
            }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem"
              }}>
                {included.map((item, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <Check style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "#1e5f79"
                    }} />
                    <span style={{
                      color: "#666666",
                      fontSize: "1rem"
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Payment & Insurance */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Payment & Insurance
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              <div style={{
                padding: "2rem",
                backgroundColor: "#eff8ff",
                borderRadius: "1rem",
                border: "2px solid #c8eaeb"
              }}>
                <Shield style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  color: "#1e5f79",
                  marginBottom: "1rem"
                }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#000000"
                }}>
                  Payment Options
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  color: "#666666"
                }}>
                  <li style={{ marginBottom: "0.5rem" }}>• Cash payment to therapist</li>
                  <li style={{ marginBottom: "0.5rem" }}>• Online payment (UPI, Cards)</li>
                  <li style={{ marginBottom: "0.5rem" }}>• Corporate billing available</li>
                  <li>• Digital receipts provided</li>
                </ul>
              </div>

              <div style={{
                padding: "2rem",
                backgroundColor: "#eff8ff",
                borderRadius: "1rem",
                border: "2px solid #c8eaeb"
              }}>
                <Users style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  color: "#1e5f79",
                  marginBottom: "1rem"
                }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#000000"
                }}>
                  Insurance
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  color: "#666666"
                }}>
                  <li style={{ marginBottom: "0.5rem" }}>• Cashless claims with major insurers</li>
                  <li style={{ marginBottom: "0.5rem" }}>• Reimbursement support</li>
                  <li style={{ marginBottom: "0.5rem" }}>• TPA coordination</li>
                  <li>• Documentation assistance</li>
                </ul>
              </div>
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
              Ready to Start Your Recovery?
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Choose the service that best fits your needs and budget
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
                Book Your Session
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}