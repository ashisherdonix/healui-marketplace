import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Users, Heart, Target, CheckCircle, Mail, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Healui - Join Our Healthcare Team",
  description: "Join Healui's mission to make quality physiotherapy accessible to everyone. Explore career opportunities with India's leading home healthcare platform.",
  keywords: "healui careers, physiotherapy jobs, healthcare jobs, work at healui, physiotherapist jobs"
};

export default function CareersPage() {
  const values = [
    {
      icon: Heart,
      title: "Patient-First",
      description: "We put patient care and outcomes at the center of everything we do"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for clinical excellence and continuous improvement"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and mutual support"
    }
  ];

  const benefits = [
    "Competitive salary and performance bonuses",
    "Comprehensive health insurance",
    "Flexible working arrangements",
    "Professional development opportunities",
    "Continuing education support",
    "Technology and equipment provided",
    "Career advancement paths",
    "Work-life balance initiatives"
  ];

  const departments = [
    {
      dept: "Clinical Team",
      roles: "Physiotherapists, Clinical Specialists, Quality Assurance"
    },
    {
      dept: "Technology",
      roles: "Software Engineers, Product Managers, UX/UI Designers"
    },
    {
      dept: "Operations",
      roles: "Operations Managers, Customer Success, Logistics"
    },
    {
      dept: "Business",
      roles: "Sales, Marketing, Business Development, Analytics"
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
              Join Our Mission
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Help us make quality physiotherapy accessible to everyone, everywhere
            </p>
          </div>
        </section>

        {/* Company Mission */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "2rem",
              color: "#000000"
            }}>
              About Healui
            </h2>
            <p style={{
              fontSize: "1.125rem",
              color: "#666666",
              lineHeight: "1.6",
              marginBottom: "2rem"
            }}>
              Healui is transforming healthcare by making professional physiotherapy accessible 
              at home. We&apos;re building India&apos;s largest network of qualified physiotherapists 
              and leveraging technology to deliver personalized care where patients need it most.
            </p>
            <p style={{
              fontSize: "1.125rem",
              color: "#666666",
              lineHeight: "1.6"
            }}>
              Join us in our mission to improve lives, one session at a time.
            </p>
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Our Values
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem"
            }}>
              {values.map((value, index) => (
                <div key={index} style={{
                  backgroundColor: "#eff8ff",
                  padding: "2rem",
                  borderRadius: "1rem",
                  textAlign: "center",
                  border: "2px solid #c8eaeb"
                }}>
                  <value.icon style={{ 
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
                    {value.title}
                  </h3>
                  <p style={{ color: "#666666" }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "2rem",
              color: "#000000"
            }}>
              Current Openings
            </h2>
            
            <div style={{
              backgroundColor: "#ffffff",
              padding: "3rem 2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              border: "2px solid #c8eaeb"
            }}>
              <div style={{
                width: "4rem",
                height: "4rem",
                backgroundColor: "#c8eaeb",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem"
              }}>
                <Users style={{
                  width: "2rem",
                  height: "2rem",
                  color: "#1e5f79"
                }} />
              </div>
              
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#000000"
              }}>
                No Current Openings
              </h3>
              
              <p style={{
                fontSize: "1.125rem",
                color: "#666666",
                marginBottom: "1.5rem",
                lineHeight: "1.6"
              }}>
                We don&apos;t have any open positions at the moment, but we&apos;re always looking 
                for talented individuals to join our team. Submit your details below to 
                be notified when relevant opportunities become available.
              </p>
              
              <div style={{
                backgroundColor: "#eff8ff",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                marginBottom: "2rem"
              }}>
                <h4 style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "#000000"
                }}>
                  We typically hire for:
                </h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {departments.map((dept, index) => (
                    <div key={index} style={{
                      textAlign: "left",
                      padding: "0.75rem",
                      backgroundColor: "#ffffff",
                      borderRadius: "0.5rem"
                    }}>
                      <strong style={{ color: "#1e5f79" }}>{dept.dept}:</strong>
                      <span style={{ color: "#666666", marginLeft: "0.5rem" }}>{dept.roles}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Why Work With Us?
            </h2>
            <div style={{
              backgroundColor: "#eff8ff",
              padding: "2rem",
              borderRadius: "1rem",
              border: "2px solid #c8eaeb"
            }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem"
              }}>
                {benefits.map((benefit, index) => (
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
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Talent Pool */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#000000"
            }}>
              Join Our Talent Pool
            </h2>
            <p style={{ 
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "2rem"
            }}>
              Be the first to know when we have openings that match your skills
            </p>
            
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
            }}>
              <Bell style={{
                width: "2.5rem",
                height: "2.5rem",
                color: "#1e5f79",
                margin: "0 auto 1rem"
              }} />
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#000000"
              }}>
                Get Notified About Future Openings
              </h3>
              <p style={{
                color: "#666666",
                marginBottom: "1.5rem"
              }}>
                Send your resume to our HR team and we&apos;ll contact you when suitable positions open up.
              </p>
              <a href="mailto:careers@healui.com?subject=Join Talent Pool">
                <button style={{
                  padding: "0.875rem 2rem",
                  backgroundColor: "#1e5f79",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto"
                }}>
                  <Mail style={{ width: "1rem", height: "1rem" }} />
                  Submit Your Resume
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Contact HR */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#000000"
            }}>
              Have Questions?
            </h2>
            <p style={{ 
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "2rem"
            }}>
              Our HR team is here to answer any questions about working at Healui
            </p>
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <a href="mailto:careers@healui.com">
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
                  Email HR Team
                </button>
              </a>
              <Link href="/contact">
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
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}