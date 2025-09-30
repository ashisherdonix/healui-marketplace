import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Trophy, Target, Activity, Clock, Star, Users, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Sports Physiotherapy | Healui - Athletic Performance & Injury Recovery",
  description: "Expert sports physiotherapy for athletes at all levels. Enhance performance, prevent injuries, and accelerate recovery with specialized treatment at home.",
  keywords: "sports physiotherapy, sports physio, athletic performance, sports injury recovery, sports rehabilitation, performance enhancement"
};

export default function SportsPhysioPage() {
  const sportsTypes = [
    "Cricket",
    "Football", 
    "Basketball",
    "Tennis",
    "Badminton",
    "Running",
    "Swimming",
    "Gym Training"
  ];

  const services = [
    {
      icon: Target,
      title: "Performance Enhancement",
      description: "Optimize your athletic performance with specialized training and conditioning"
    },
    {
      icon: Shield,
      title: "Injury Prevention",
      description: "Proactive strategies to prevent common sports-related injuries"
    },
    {
      icon: Zap,
      title: "Recovery Acceleration",
      description: "Faster healing from sports injuries with evidence-based protocols"
    },
    {
      icon: Activity,
      title: "Movement Analysis",
      description: "Detailed biomechanical assessment to improve technique and efficiency"
    }
  ];

  const commonInjuries = [
    "ACL/PCL Tears",
    "Ankle Sprains",
    "Tennis/Golfer's Elbow",
    "Rotator Cuff Injuries",
    "Hamstring Strains",
    "Knee Injuries",
    "Back Pain",
    "Shoulder Impingement"
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
              Sports Physiotherapy Excellence
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Enhance performance, prevent injuries, and accelerate recovery
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
                Book Sports Physio
              </button>
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Specialized Sports Physiotherapy Services
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem"
            }}>
              {services.map((service, index) => (
                <div key={index} style={{
                  backgroundColor: "#ffffff",
                  padding: "2rem",
                  borderRadius: "1rem",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  <service.icon style={{ 
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
                    {service.title}
                  </h3>
                  <p style={{ color: "#666666" }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sports Covered */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Sports We Specialize In
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem"
            }}>
              {sportsTypes.map((sport, index) => (
                <div key={index} style={{
                  padding: "1.5rem",
                  backgroundColor: "#c8eaeb",
                  borderRadius: "0.75rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <Trophy style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "600" }}>{sport}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Injuries */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Common Sports Injuries We Treat
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              maxWidth: "900px",
              margin: "0 auto"
            }}>
              {commonInjuries.map((injury, index) => (
                <div key={index} style={{
                  padding: "1rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "0.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <Activity style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "500" }}>{injury}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Our Sports Physio Process
            </h2>
            <div style={{ display: "grid", gap: "2rem" }}>
              {[
                { 
                  step: "1", 
                  title: "Sport-Specific Assessment", 
                  desc: "Comprehensive evaluation of your sport, position, and movement patterns" 
                },
                { 
                  step: "2", 
                  title: "Performance Analysis", 
                  desc: "Identify strengths, weaknesses, and injury risk factors" 
                },
                { 
                  step: "3", 
                  title: "Customized Treatment", 
                  desc: "Tailored therapy plan for your sport and performance goals" 
                },
                { 
                  step: "4", 
                  title: "Return to Play", 
                  desc: "Gradual return to sport with ongoing performance optimization" 
                }
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
              Ready to Enhance Your Performance?
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Book a sports physiotherapy session and take your game to the next level
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
                Find Sports Physiotherapist
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}