import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Home, CheckCircle, Clock, Shield, Calendar, MapPin, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Physiotherapy Services | Healui - Professional Physio at Your Doorstep",
  description: "Get professional physiotherapy treatment at home. Our certified physiotherapists provide personalized care for back pain, post-surgery recovery, sports injuries, and more in the comfort of your home.",
  keywords: "home physiotherapy, physiotherapy at home, home physio service, physio home visit, doorstep physiotherapy, home rehabilitation"
};

export default function HomePhysiotherapyPage() {
  const benefits = [
    {
      icon: Home,
      title: "Comfort of Home",
      description: "Receive treatment in familiar surroundings without travel stress"
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "Book sessions at your convenient time, including weekends"
    },
    {
      icon: Shield,
      title: "Personalized Care",
      description: "One-on-one attention with customized treatment plans"
    },
    {
      icon: MapPin,
      title: "No Travel Hassles",
      description: "Save time and energy, especially beneficial for mobility issues"
    }
  ];

  const conditions = [
    "Back & Neck Pain",
    "Post-Surgery Rehabilitation",
    "Sports Injuries",
    "Arthritis & Joint Pain",
    "Neurological Conditions",
    "Elderly Care",
    "Pediatric Conditions",
    "Women's Health Issues"
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
              Professional Physiotherapy at Your Home
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Expert physiotherapists, personalized treatment plans, in the comfort of your home
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
                Book Home Visit
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
              Why Choose Home Physiotherapy?
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

        {/* Conditions Treated */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Conditions We Treat at Home
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem"
            }}>
              {conditions.map((condition, index) => (
                <div key={index} style={{
                  padding: "1rem",
                  backgroundColor: "#c8eaeb",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <CheckCircle style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "500" }}>{condition}</span>
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
              How Home Physiotherapy Works
            </h2>
            <div style={{ display: "grid", gap: "2rem" }}>
              {[
                { step: "1", title: "Book Appointment", desc: "Choose your preferred date and time slot" },
                { step: "2", title: "Physiotherapist Visits", desc: "Qualified physio arrives with necessary equipment" },
                { step: "3", title: "Assessment & Treatment", desc: "Comprehensive evaluation and personalized treatment" },
                { step: "4", title: "Follow-up Care", desc: "Regular sessions and progress monitoring" }
              ].map((item, index) => (
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
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#666666" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
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
              Ready to Start Your Recovery at Home?
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Book a certified physiotherapist for home visit today
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
                Find Physiotherapist
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}