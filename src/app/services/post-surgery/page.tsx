import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Heart, Activity, TrendingUp, UserCheck, Calendar, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Post Surgery Physiotherapy | Healui - Recovery & Rehabilitation",
  description: "Expert post-surgery physiotherapy care at home. Accelerate recovery after orthopedic, cardiac, or other surgeries with personalized rehabilitation programs.",
  keywords: "post surgery physiotherapy, post operative physio, surgery rehabilitation, recovery physiotherapy, post surgical care"
};

export default function PostSurgeryPage() {
  const surgeryTypes = [
    "Knee Replacement",
    "Hip Replacement", 
    "ACL Reconstruction",
    "Spine Surgery",
    "Shoulder Surgery",
    "Cardiac Surgery",
    "Fracture Recovery",
    "Ligament Repair"
  ];

  const recoveryPhases = [
    {
      phase: "Phase 1",
      title: "Immediate Post-Op",
      duration: "0-2 weeks",
      focus: "Pain management, swelling reduction, gentle mobilization"
    },
    {
      phase: "Phase 2", 
      title: "Early Recovery",
      duration: "2-6 weeks",
      focus: "Range of motion, basic strengthening, functional activities"
    },
    {
      phase: "Phase 3",
      title: "Strengthening",
      duration: "6-12 weeks", 
      focus: "Progressive strengthening, balance, coordination"
    },
    {
      phase: "Phase 4",
      title: "Return to Function",
      duration: "3-6 months",
      focus: "Advanced activities, sports-specific training, full recovery"
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
              Post-Surgery Physiotherapy Care
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Accelerate your recovery with expert rehabilitation at home
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
                Start Recovery Journey
              </button>
            </Link>
          </div>
        </section>

        {/* Surgery Types */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              We Specialize in Post-Surgery Care For
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem"
            }}>
              {surgeryTypes.map((surgery, index) => (
                <div key={index} style={{
                  padding: "1.5rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  textAlign: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <Heart style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "600" }}>{surgery}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recovery Phases */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Your Recovery Journey
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {recoveryPhases.map((phase, index) => (
                <div key={index} style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  padding: "1.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid #1e5f79"
                }}>
                  <div style={{
                    backgroundColor: "#1e5f79",
                    color: "#ffffff",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: "700",
                    whiteSpace: "nowrap"
                  }}>
                    {phase.phase}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem", color: "#000000" }}>
                      {phase.title}
                    </h3>
                    <p style={{ color: "#1e5f79", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                      Duration: {phase.duration}
                    </p>
                    <p style={{ color: "#666666" }}>
                      {phase.focus}
                    </p>
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
              Why Choose Healui for Post-Surgery Care?
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              <div style={{
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <Activity style={{ 
                  width: "3rem", 
                  height: "3rem", 
                  color: "#1e5f79",
                  marginBottom: "1rem"
                }} />
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                  Faster Recovery
                </h3>
                <p style={{ color: "#666666" }}>
                  Evidence-based protocols designed to accelerate healing and restore function quickly
                </p>
              </div>
              <div style={{
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <TrendingUp style={{ 
                  width: "3rem", 
                  height: "3rem", 
                  color: "#1e5f79",
                  marginBottom: "1rem"
                }} />
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                  Progress Tracking
                </h3>
                <p style={{ color: "#666666" }}>
                  Regular assessments to monitor your recovery milestones and adjust treatment plans
                </p>
              </div>
              <div style={{
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <UserCheck style={{ 
                  width: "3rem", 
                  height: "3rem", 
                  color: "#1e5f79",
                  marginBottom: "1rem"
                }} />
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000000" }}>
                  Expert Therapists
                </h3>
                <p style={{ color: "#666666" }}>
                  Specialized physiotherapists experienced in post-surgical rehabilitation
                </p>
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
              Begin Your Recovery Today
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Get personalized post-surgery care from certified physiotherapists
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
                Book Consultation
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}