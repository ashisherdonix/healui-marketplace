'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ChevronRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Services',
      links: [
        { name: 'Physiotherapy at Home', href: '/services/home-physiotherapy' },
        { name: 'Online Consultation', href: '/services/online-consultation' },
        { name: 'Post Surgery Care', href: '/services/post-surgery' },
        { name: 'Sports Physiotherapy', href: '/services/sports-physio' },
        { name: 'Elderly Care', href: '/services/elderly-care' },
        { name: 'Pediatric Physio', href: '/services/pediatric' }
      ]
    },
    {
      title: 'For Patients',
      links: [
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'Book Appointment', href: '/' },
        { name: 'Find Physiotherapist', href: '/' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Insurance', href: '/insurance' },
        { name: 'FAQs', href: '/faqs' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
        { name: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
        { name: 'Disclaimer', href: '/disclaimer' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/healui', name: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/healui', name: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/healui', name: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/healui', name: 'Twitter' }
  ];

  return (
    <footer style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {/* Main Footer */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem)' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: 'clamp(2rem, 5vw, 3rem)'
        }}>
          {/* Company Info */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <img 
                src="/healui-logo-white.png" 
                alt="Healui" 
                style={{ 
                  height: 'clamp(2rem, 4vw, 2.5rem)',
                  marginBottom: '1rem'
                }} 
              />
              <p style={{ 
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '1.6',
                opacity: 0.9,
                marginBottom: '1rem'
              }}>
                Your trusted partner for professional physiotherapy at home. 
                Get expert care in the comfort of your home.
              </p>
            </div>
            
            {/* Contact Info */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <a 
                href="tel:+911800HEALUI" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  opacity: 0.9
                }}
              >
                <Phone style={{ width: '1rem', height: '1rem' }} />
                +91-1800-HEALUI
              </a>
              <a 
                href="mailto:support@healui.com" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  opacity: 0.9
                }}
              >
                <Mail style={{ width: '1rem', height: '1rem' }} />
                support@healui.com
              </a>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.5rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                opacity: 0.9
              }}>
                <MapPin style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.125rem' }} />
                <span>Available in Delhi NCR, Mumbai, Bangalore, Chennai, Pune & more</span>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem',
              marginTop: '1.5rem'
            }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e5f79';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label={social.name}
                >
                  <social.icon style={{ width: '1.25rem', height: '1.25rem' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 style={{ 
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link) => (
                  <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      href={link.href}
                      style={{
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        opacity: 0.8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ChevronRight style={{ width: '0.875rem', height: '0.875rem' }} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Join as Physiotherapist Section */}
        <div style={{
          padding: '2rem',
          backgroundColor: 'rgba(30, 95, 121, 0.1)',
          borderRadius: '1rem',
          marginBottom: '2rem',
          textAlign: 'center',
          border: '2px solid rgba(30, 95, 121, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Are You a Physiotherapist?
          </h3>
          <p style={{ 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            opacity: 0.9,
            marginBottom: '1.5rem'
          }}>
            Join thousands of physiotherapists providing quality care at home. Grow your practice with Healui.
          </p>
          <a 
            href="https://clinic.healui.com" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#ffffff',
              color: '#1e5f79',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            🩺 Join as Physiotherapist!
          </a>
        </div>

        {/* Download App Section */}
        <div style={{
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            marginBottom: '1rem'
          }}>
            Download Healui App
          </h3>
          <p style={{ 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            opacity: 0.9,
            marginBottom: '1.5rem'
          }}>
            Book appointments, track sessions, and manage your health on the go
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://play.google.com/store/apps/healui" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1e5f79',
                color: '#ffffff',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get it on Google Play
            </a>
            <a 
              href="https://apps.apple.com/app/healui" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1e5f79',
                color: '#ffffff',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Download on App Store
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            opacity: 0.8
          }}>
            <span>Made with</span>
            <Heart style={{ width: '1rem', height: '1rem', color: '#dc2626', fill: '#dc2626' }} />
            <span>in India</span>
          </div>
          <p style={{ 
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            opacity: 0.7
          }}>
            © {new Date().getFullYear()} Healui Healthcare Private Limited. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;