"use client";

import Header from "@/components/layout/Header";
import Link from "next/link";
import { ChevronDown, Phone, Mail, MessageCircle } from "lucide-react";

export default function FAQsPage() {
  const faqCategories = [
    {
      category: "Booking & Scheduling",
      faqs: [
        {
          question: "How do I book a physiotherapy session?",
          answer: "You can book a session through our website by searching for physiotherapists in your area, selecting your preferred therapist, and choosing an available time slot. You can also call our support team at +91-1800-HEALUI."
        },
        {
          question: "How far in advance can I book an appointment?",
          answer: "You can book appointments up to 30 days in advance. We also offer same-day booking based on therapist availability."
        },
        {
          question: "Can I reschedule or cancel my appointment?",
          answer: "Yes, you can reschedule or cancel your appointment up to 2 hours before the scheduled time without any charges. Cancellations within 2 hours may incur a cancellation fee."
        },
        {
          question: "What if the physiotherapist is late or doesn't show up?",
          answer: "If your therapist is running late, they will notify you in advance. In case of a no-show, we will immediately arrange an alternative therapist or provide a full refund."
        }
      ]
    },
    {
      category: "Services & Treatment",
      faqs: [
        {
          question: "What conditions do you treat?",
          answer: "We treat a wide range of conditions including back pain, neck pain, sports injuries, post-surgery rehabilitation, arthritis, neurological conditions, and more. Our physiotherapists specialize in various areas including sports physio, elderly care, and pediatric physiotherapy."
        },
        {
          question: "What's the difference between home visits and online consultations?",
          answer: "Home visits involve a physiotherapist coming to your location with equipment for hands-on treatment. Online consultations are video calls for assessment, exercise guidance, and advice. Home visits are better for hands-on treatment, while online consultations work well for follow-ups and exercise guidance."
        },
        {
          question: "How long is each session?",
          answer: "Home visit sessions typically last 45-60 minutes, while online consultations are usually 30-45 minutes. Extended 90-minute sessions are also available for complex conditions."
        },
        {
          question: "Will I get the same physiotherapist for all sessions?",
          answer: "We try to assign the same physiotherapist for continuity of care, especially for package bookings. If your regular therapist is unavailable, we'll assign another qualified physiotherapist familiar with your case."
        }
      ]
    },
    {
      category: "Pricing & Payment",
      faqs: [
        {
          question: "How much does a physiotherapy session cost?",
          answer: "Home visits start from ₹800 for a 45-60 minute session, and online consultations start from ₹400 for 30-45 minutes. We also offer package deals for multiple sessions at discounted rates."
        },
        {
          question: "Are there any hidden charges?",
          answer: "No, we believe in transparent pricing. The only additional charges are for weekend/holiday sessions (+₹100) or emergency same-day bookings (+₹200). All charges are clearly mentioned before booking."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash payments to the therapist, online payments through UPI, credit/debit cards, and net banking. Corporate billing is also available for company bookings."
        },
        {
          question: "Do you accept insurance?",
          answer: "Yes, we work with major insurance providers for cashless claims and reimbursements. We also provide all necessary documentation for insurance claims."
        }
      ]
    },
    {
      category: "Physiotherapists & Quality",
      faqs: [
        {
          question: "Are your physiotherapists qualified and licensed?",
          answer: "Yes, all our physiotherapists are licensed professionals with degrees from recognized institutions. They undergo background verification and continuous training to maintain quality standards."
        },
        {
          question: "How do you ensure quality of treatment?",
          answer: "We have a rigorous selection process for physiotherapists, regular quality audits, patient feedback systems, and continuous professional development programs. Patient satisfaction is monitored for every session."
        },
        {
          question: "Can I choose my physiotherapist?",
          answer: "Yes, you can browse physiotherapist profiles, read reviews, and choose based on specialization, experience, and patient ratings. You can also request a specific therapist for future appointments."
        },
        {
          question: "What if I'm not satisfied with the treatment?",
          answer: "If you're not satisfied with your session, please contact our support team immediately. We offer session credits or refunds based on legitimate concerns and will assign a different therapist for future sessions."
        }
      ]
    },
    {
      category: "Safety & Hygiene",
      faqs: [
        {
          question: "What safety measures do you follow?",
          answer: "Our physiotherapists follow strict hygiene protocols including sanitization of equipment before and after each session, wearing masks and gloves when required, and maintaining proper safety measures as per health guidelines."
        },
        {
          question: "Do physiotherapists bring their own equipment?",
          answer: "Yes, our physiotherapists come fully equipped with professional-grade equipment including exercise tools, electrotherapy devices, and other necessary items for effective treatment."
        },
        {
          question: "Is it safe to have a physiotherapist at home?",
          answer: "Absolutely. All our physiotherapists undergo background verification and identity checks. We also provide real-time tracking and have 24/7 support for any concerns."
        }
      ]
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
              Frequently Asked Questions
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}>
              Find quick answers to common questions about our physiotherapy services
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} style={{ marginBottom: "3rem" }}>
                <h2 style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "1.5rem",
                  color: "#1e5f79",
                  borderBottom: "2px solid #c8eaeb",
                  paddingBottom: "0.5rem"
                }}>
                  {category.category}
                </h2>
                
                <div style={{ display: "grid", gap: "1rem" }}>
                  {category.faqs.map((faq, faqIndex) => (
                    <details key={faqIndex} style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0.75rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden"
                    }}>
                      <summary style={{
                        padding: "1.5rem",
                        cursor: "pointer",
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#000000",
                        borderBottom: "1px solid #f3f4f6",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        listStyle: "none"
                      }}>
                        <span>{faq.question}</span>
                        <ChevronDown style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#1e5f79",
                          transition: "transform 0.2s ease"
                        }} />
                      </summary>
                      <div style={{
                        padding: "1.5rem",
                        paddingTop: "1rem",
                        color: "#666666",
                        lineHeight: "1.6"
                      }}>
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section style={{ padding: "4rem 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              marginBottom: "1rem",
              color: "#000000"
            }}>
              Still Need Help?
            </h2>
            <p style={{ 
              fontSize: "1.125rem",
              color: "#666666",
              marginBottom: "3rem"
            }}>
              Our support team is here to help you with any questions or concerns
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem"
            }}>
              <a href="tel:+911800HEALUI" style={{
                textDecoration: "none",
                backgroundColor: "#eff8ff",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #c8eaeb",
                display: "block",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Phone style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  color: "#1e5f79",
                  margin: "0 auto 1rem"
                }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#000000"
                }}>
                  Call Us
                </h3>
                <p style={{ color: "#666666", marginBottom: "0.5rem" }}>
                  Speak with our support team
                </p>
                <p style={{ 
                  color: "#1e5f79",
                  fontWeight: "600",
                  fontSize: "1.125rem"
                }}>
                  +91-1800-HEALUI
                </p>
              </a>

              <a href="mailto:support@healui.com" style={{
                textDecoration: "none",
                backgroundColor: "#eff8ff",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #c8eaeb",
                display: "block",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Mail style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  color: "#1e5f79",
                  margin: "0 auto 1rem"
                }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#000000"
                }}>
                  Email Us
                </h3>
                <p style={{ color: "#666666", marginBottom: "0.5rem" }}>
                  Send us your questions
                </p>
                <p style={{ 
                  color: "#1e5f79",
                  fontWeight: "600",
                  fontSize: "1.125rem"
                }}>
                  support@healui.com
                </p>
              </a>

              <div style={{
                backgroundColor: "#eff8ff",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #c8eaeb"
              }}>
                <MessageCircle style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  color: "#1e5f79",
                  margin: "0 auto 1rem"
                }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#000000"
                }}>
                  Live Chat
                </h3>
                <p style={{ color: "#666666", marginBottom: "1rem" }}>
                  Chat with our support team
                </p>
                <button style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#1e5f79",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  Start Chat
                </button>
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
              Ready to Book Your Session?
            </h2>
            <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#1e5f79" }}>
              Start your physiotherapy journey with Healui today
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

        {/* FAQ Accordion CSS */}
        <style jsx>{`
          details[open] summary svg {
            transform: rotate(180deg);
          }
        `}</style>
      </div>
    </>
  );
}