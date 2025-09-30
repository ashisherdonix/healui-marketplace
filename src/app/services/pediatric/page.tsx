import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Baby, Heart, Star, Users, Smile, Shield, Activity, CheckCircle, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Pediatric Physiotherapy | Healui - Children's Physio at Home",
  description: "Specialized pediatric physiotherapy for children at home. Expert care for developmental delays, injuries, and neurological conditions in a child-friendly environment.",
  keywords: "pediatric physiotherapy, children physiotherapy, kids physio, pediatric rehab, child development, pediatric care at home"
};

export default function PediatricPage() {
  const conditions = [
    "Developmental Delays",
    "Cerebral Palsy",
    "Muscular Dystrophy",
    "Sports Injuries",
    "Torticollis",
    "Scoliosis",
    "Gross Motor Delays",
    "Post-Surgery Recovery"
  ];

  const benefits = [
    {
      icon: Home,
      title: "Familiar Environment",
      description: "Children feel more comfortable and cooperative at home"
    },
    {
      icon: Users,
      title: "Family Involvement",
      description: "Parents learn techniques to support ongoing development"
    },
    {
      icon: Smile,
      title: "Play-Based Therapy",
      description: "Fun, engaging activities that don't feel like treatment"
    },
    {
      icon: Shield,
      title: "Specialized Care",
      description: "Therapists trained specifically in pediatric conditions"
    }
  ];

  const ageGroups = [
    {
      age: "0-2 Years",
      title: "Infants & Toddlers",
      focus: "Motor milestones, feeding, positioning"
    },
    {
      age: "3-5 Years", 
      title: "Preschoolers",
      focus: "Balance, coordination, school readiness"
    },
    {
      age: "6-12 Years",
      title: "School Age",
      focus: "Sports skills, strength, confidence"
    },
    {
      age: "13-18 Years",
      title: "Teenagers",
      focus: "Athletic performance, injury recovery"
    }
  ];

  const playBasedActivities = [
    "Obstacle Courses",
    "Ball Games",
    "Dance & Movement",
    "Sensory Play",
    "Balance Games",
    "Strength Building Fun",
    "Coordination Challenges",
    "Interactive Exercises"
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
              Pediatric Physiotherapy at Home
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Specialized physiotherapy for children in a fun, familiar environment
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
                Book Pediatric Care
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
              Why Choose Home-Based Pediatric Physiotherapy?
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

        {/* Age Groups */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Age-Specific Care Programs
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {ageGroups.map((group, index) => (
                <div key={index} style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  padding: "1.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid #1e5f79"
                }}>
                  <div style={{
                    backgroundColor: "#1e5f79",
                    color: "#ffffff",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: "700",
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap"
                  }}>
                    {group.age}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem", color: "#000000" }}>
                      {group.title}
                    </h3>
                    <p style={{ color: "#666666" }}>
                      Focus: {group.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conditions Treated */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "3rem",
              color: "#000000"
            }}>
              Pediatric Conditions We Treat
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
                  <Baby style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "500" }}>{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Play-Based Therapy */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              textAlign: "center", 
              marginBottom: "2rem",
              color: "#000000"
            }}>
              Fun, Play-Based Therapy Activities
            </h2>
            <p style={{ 
              textAlign: "center",
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "3rem",
              maxWidth: "600px",
              margin: "0 auto 3rem"
            }}>
              We make therapy enjoyable through games and activities that children love!
            </p>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem"
            }}>
              {playBasedActivities.map((activity, index) => (
                <div key={index} style={{
                  padding: "1rem",
                  backgroundColor: "#eff8ff",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  border: "2px solid #c8eaeb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <Star style={{ width: "1.25rem", height: "1.25rem", color: "#1e5f79" }} />
                  <span style={{ color: "#000000", fontWeight: "500" }}>{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parent Education */}
        <section style={{ 
          padding: "4rem 0",
          backgroundColor: "#f8f9fa"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "2rem",
              color: "#000000"
            }}>
              Empowering Parents & Caregivers
            </h2>
            <div style={{ 
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <Users style={{ 
                width: "3rem", 
                height: "3rem", 
                color: "#1e5f79",
                margin: "0 auto 1rem"
              }} />
              <p style={{ 
                fontSize: "1.125rem",
                color: "#666666",
                lineHeight: "1.6",
                marginBottom: "1.5rem"
              }}>
                We believe parents are the most important part of a child&apos;s therapy team. 
                Our physiotherapists teach you techniques and exercises to continue supporting 
                your child&apos;s development between sessions.
              </p>
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  <span style={{ color: "#666666", fontSize: "0.95rem" }}>Home exercise programs</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  <span style={{ color: "#666666", fontSize: "0.95rem" }}>Activity modifications</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  <span style={{ color: "#666666", fontSize: "0.95rem" }}>Equipment recommendations</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle style={{ width: "1rem", height: "1rem", color: "#1e5f79" }} />
                  <span style={{ color: "#666666", fontSize: "0.95rem" }}>Progress monitoring tips</span>
                </div>
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
              Help Your Child Reach Their Full Potential
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Book specialized pediatric physiotherapy in the comfort of your home
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
                Book Pediatric Physiotherapy
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}