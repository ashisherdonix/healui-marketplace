import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Heart, Shield, Clock, Home, Users, Star, Activity, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Elderly Care Physiotherapy | Healui - Senior Citizen Physio at Home",
  description: "Specialized physiotherapy for elderly patients at home. Improve mobility, prevent falls, manage arthritis, and enhance quality of life for seniors.",
  keywords: "elderly physiotherapy, senior citizen physio, geriatric physiotherapy, elderly care at home, senior mobility, fall prevention"
};

export default function ElderlyCarePage() {
  const conditions = [
    "Arthritis & Joint Pain",
    "Balance & Fall Prevention",
    "Stroke Recovery",
    "Osteoporosis Management",
    "Parkinson's Disease",
    "Post-Hip Replacement",
    "Chronic Pain Management",
    "Mobility Improvement"
  ];

  const benefits = [
    {
      icon: Home,
      title: "Comfort of Home",
      description: "Receive care in familiar surroundings without travel stress"
    },
    {
      icon: Shield,
      title: "Fall Prevention",
      description: "Specialized programs to reduce fall risk and improve balance"
    },
    {
      icon: Heart,
      title: "Gentle Approach",
      description: "Age-appropriate exercises designed for senior comfort and safety"
    },
    {
      icon: Users,
      title: "Family Involvement",
      description: "Educate family members on safe assistance and exercise support"
    }
  ];

  const services = [
    {
      title: "Mobility Training",
      description: "Improve walking, transfers, and daily movement activities",
      icon: Activity
    },
    {
      title: "Balance Enhancement",
      description: "Specialized exercises to prevent falls and improve stability",
      icon: Shield
    },
    {
      title: "Pain Management",
      description: "Gentle techniques to manage chronic pain and stiffness",
      icon: Heart
    },
    {
      title: "Strength Building",
      description: "Safe strengthening exercises to maintain independence",
      icon: Star
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
              Specialized Elderly Care Physiotherapy
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Compassionate physiotherapy for seniors in the comfort of home
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
                Book Senior Care
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
              Why Choose Our Elderly Care Services?
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
              Conditions We Specialize in for Seniors
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem"
            }}>
              {conditions.map((condition, index) => (
                <div key={index} style={{
                  padding: "1rem",
                  backgroundColor: "#c8eaeb",
                  borderRadius: "0.5rem",
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

        {/* Services */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Our Specialized Services for Seniors
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {services.map((service, index) => (
                <div key={index} style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  padding: "1.5rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  borderLeft: "4px solid #1e5f79"
                }}>
                  <service.icon style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    color: "#1e5f79",
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                      {service.title}
                    </h3>
                    <p style={{ color: "#666666" }}>
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety First */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "2rem",
              color: "#000000"
            }}>
              Safety & Comfort First
            </h2>
            <div style={{ 
              backgroundColor: "#eff8ff",
              padding: "2rem",
              borderRadius: "1rem",
              border: "2px solid #c8eaeb"
            }}>
              <Shield style={{ 
                width: "3rem", 
                height: "3rem", 
                color: "#1e5f79",
                margin: "0 auto 1rem"
              }} />
              <p style={{ 
                fontSize: "1.125rem",
                color: "#666666",
                lineHeight: "1.6",
                marginBottom: "1rem"
              }}>
                Our elderly care physiotherapists are specially trained in geriatric care, 
                ensuring all exercises and treatments are safe, gentle, and appropriate for senior patients.
              </p>
              <ul style={{ 
                textAlign: "left", 
                color: "#666666",
                lineHeight: "1.6",
                listStyle: "none",
                padding: 0
              }}>
                <li style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  Fall risk assessment and prevention strategies
                </li>
                <li style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  Medication interaction awareness
                </li>
                <li style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  Age-appropriate exercise modifications
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  Family caregiver education and support
                </li>
              </ul>
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
              Give Your Loved Ones the Best Care
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Book compassionate physiotherapy care for seniors at home
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
                Book Elderly Care
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}