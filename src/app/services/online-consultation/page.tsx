import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Video, Globe, Clock, Shield, Smartphone, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Physiotherapy Consultation | Healui - Virtual Physio Sessions",
  description: "Connect with certified physiotherapists online. Get expert guidance, exercise programs, and rehabilitation support through secure video consultations from anywhere.",
  keywords: "online physiotherapy, virtual physiotherapy, tele physiotherapy, online physio consultation, video physiotherapy, remote physiotherapy"
};

export default function OnlineConsultationPage() {
  const benefits = [
    {
      icon: Globe,
      title: "Access from Anywhere",
      description: "Consult expert physiotherapists from any location"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "No travel time, immediate access to care"
    },
    {
      icon: Video,
      title: "HD Video Sessions",
      description: "Clear video quality for effective assessment"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA compliant platform for your privacy"
    }
  ];

  const suitable = [
    "Exercise Program Guidance",
    "Posture Correction",
    "Pain Management Advice",
    "Post-Surgery Follow-ups",
    "Ergonomic Consultations",
    "Sports Performance Tips",
    "Injury Prevention",
    "Chronic Pain Management"
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
              Online Physiotherapy Consultations
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Expert physiotherapy care through secure video consultations
            </p>
            <Link href="/">
              <button style={{
                padding: "1rem 2rem",
                backgroundColor: "#ffffff",
                color: "#1e5f79",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.125rem",
                fontWeight: "600",
                cursor: "pointer"
              }}>
                Book Online Session
              </button>
            </Link>
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
              Benefits of Online Physiotherapy
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

        {/* Suitable For */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Online Consultation is Perfect For
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              {suitable.map((item, index) => (
                <div key={index} style={{
                  padding: "1rem",
                  backgroundColor: "#c8eaeb",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <Video style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "500" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              How Online Consultation Works
            </h2>
            <div style={{ display: "grid", gap: "2rem" }}>
              {[
                { 
                  icon: Calendar, 
                  title: "Book Your Slot", 
                  desc: "Choose a convenient time for your video consultation" 
                },
                { 
                  icon: Smartphone, 
                  title: "Join Video Call", 
                  desc: "Connect with your physiotherapist through our secure platform" 
                },
                { 
                  icon: Video, 
                  title: "Virtual Assessment", 
                  desc: "Physiotherapist evaluates your condition through video" 
                },
                { 
                  icon: Headphones, 
                  title: "Get Treatment Plan", 
                  desc: "Receive personalized exercise program and guidance" 
                }
              ].map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  backgroundColor: "#ffffff",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <item.icon style={{
                    width: "2rem",
                    height: "2rem",
                    color: "#1e5f79",
                    flexShrink: 0
                  }} />
                  <div>
                    <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem", color: "#000000" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#666666", fontSize: "0.95rem" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section style={{ 
          padding: "3rem 0",
          backgroundColor: "#f5f5f5"
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#000000" }}>
              What You Need
            </h3>
            <p style={{ color: "#666666", marginBottom: "1rem" }}>
              • Stable internet connection<br/>
              • Smartphone, tablet, or computer with camera<br/>
              • Quiet space where you can move freely<br/>
              • Comfortable clothing
            </p>
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
              Start Your Online Physiotherapy Journey
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Connect with expert physiotherapists from the comfort of your home
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
                Book Online Consultation
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}