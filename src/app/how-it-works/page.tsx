import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Search, Calendar, UserCheck, Home, Clock, Star, CheckCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Healui - Book Physiotherapy in 3 Simple Steps",
  description: "Learn how to book physiotherapy at home with Healui. Simple 3-step process: Find physiotherapist, book appointment, get treatment at home.",
  keywords: "how healui works, book physiotherapy, physiotherapy booking process, home physiotherapy booking"
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: "1",
      icon: Search,
      title: "Find Your Physiotherapist",
      description: "Search by location, specialization, and availability. View profiles, qualifications, and patient reviews.",
      details: [
        "Browse certified physiotherapists in your area",
        "Filter by specialization (sports, elderly care, post-surgery, etc.)",
        "Read verified patient reviews and ratings",
        "View therapist qualifications and experience"
      ]
    },
    {
      step: "2", 
      icon: Calendar,
      title: "Book Your Appointment",
      description: "Select your preferred date and time slot. Choose between home visit or online consultation.",
      details: [
        "Real-time availability calendar",
        "Flexible scheduling including weekends",
        "Choose home visit or video consultation",
        "Instant booking confirmation"
      ]
    },
    {
      step: "3",
      icon: Home,
      title: "Receive Expert Care",
      description: "Your physiotherapist arrives at your location with all necessary equipment for personalized treatment.",
      details: [
        "Therapist arrives with professional equipment",
        "Comprehensive assessment and treatment plan",
        "Personalized exercises and home program",
        "Follow-up sessions as needed"
      ]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "No travel time or waiting rooms. Treatment comes to you."
    },
    {
      icon: Home,
      title: "Comfort of Home",
      description: "Receive care in familiar surroundings for better healing."
    },
    {
      icon: UserCheck,
      title: "Verified Professionals",
      description: "All physiotherapists are licensed and background verified."
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Ongoing quality monitoring and patient feedback system."
    }
  ];

  const serviceTypes = [
    {
      title: "Home Visits",
      description: "Physiotherapist comes to your home with equipment",
      price: "Starting from ₹800",
      duration: "45-60 minutes"
    },
    {
      title: "Online Consultation", 
      description: "Video consultation for assessment and guidance",
      price: "Starting from ₹400",
      duration: "30-45 minutes"
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
              How Healui Works
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Professional physiotherapy at home in 3 simple steps
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gap: "3rem" }}>
              {steps.map((step, index) => (
                <div key={index} style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "2rem",
                  alignItems: "start"
                }}>
                  {/* Step Number & Icon */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: "4rem",
                      height: "4rem",
                      backgroundColor: "#1e5f79",
                      color: "#ffffff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      marginBottom: "1rem"
                    }}>
                      {step.step}
                    </div>
                    <step.icon style={{
                      width: "2rem",
                      height: "2rem",
                      color: "#1e5f79"
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "2rem",
                    borderRadius: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    <h3 style={{ 
                      fontSize: "1.5rem", 
                      marginBottom: "0.5rem",
                      color: "#000000"
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ 
                      fontSize: "1.125rem",
                      color: "#666666",
                      marginBottom: "1.5rem"
                    }}>
                      {step.description}
                    </p>
                    <ul style={{ 
                      listStyle: "none",
                      padding: 0,
                      display: "grid",
                      gap: "0.5rem"
                    }}>
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}>
                          <CheckCircle style={{ 
                            width: "1rem", 
                            height: "1rem", 
                            color: "#1e5f79" 
                          }} />
                          <span style={{ color: "#666666" }}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Types */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Choose Your Service Type
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem"
            }}>
              {serviceTypes.map((service, index) => (
                <div key={index} style={{
                  padding: "2rem",
                  backgroundColor: "#eff8ff",
                  borderRadius: "1rem",
                  border: "2px solid #c8eaeb",
                  textAlign: "center"
                }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    marginBottom: "0.5rem",
                    color: "#000000"
                  }}>
                    {service.title}
                  </h3>
                  <p style={{ 
                    color: "#666666",
                    marginBottom: "1rem"
                  }}>
                    {service.description}
                  </p>
                  <div style={{ 
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "#1e5f79",
                    marginBottom: "0.5rem"
                  }}>
                    {service.price}
                  </div>
                  <div style={{ 
                    fontSize: "0.875rem",
                    color: "#666666"
                  }}>
                    Duration: {service.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Why Choose Healui?
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

        {/* FAQ Preview */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#000000"
            }}>
              Still Have Questions?
            </h2>
            <p style={{ 
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "2rem"
            }}>
              Check our FAQ section or contact our support team for assistance
            </p>
            <div style={{ 
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <Link href="/faqs">
                <button style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#1e5f79",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  View FAQs
                </button>
              </Link>
              <a href="tel:+911800HEALUI">
                <button style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "transparent",
                  color: "#1e5f79",
                  border: "2px solid #1e5f79",
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
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Book your first physiotherapy session today
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
                Book Now
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}