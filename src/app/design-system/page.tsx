'use client'

import Button from '@/components/button'
import Card from '@/components/card'
import { ServiceCard } from '@/components/ui/service-card'
import { TherapistCard } from '@/components/ui/therapist-card'
import { Home, Users, Calendar } from 'lucide-react'
import Image from 'next/image'

export default function DesignSystemPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-surface p-lg" style={{ borderBottom: '1px solid var(--lk-outline)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="display-flex align-items-center justify-content-between">
            <div className="display-flex align-items-center gap-md">
              <Image src="/healui-logo.png" alt="HealUI" width={48} height={48} />
              <div>
                <div className="lk-typography-headline-medium">HealUI Design System</div>
                <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>Logo-Harmonious Healthcare Design</div>
              </div>
            </div>
            <div className="display-flex gap-sm">
              <Button variant="text" size="md" label="About" />
              <Button variant="text" size="md" label="Services" />
              <Button variant="fill" size="md" label="Book Now" />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Analysis Section */}
      <div className="bg-primarycontainer p-lg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="lk-typography-headline-large mb-md">Professional Healthcare Color System</div>
          <div className="lk-typography-body-large mb-lg" style={{ color: 'var(--lk-onprimarycontainer)' }}>
            Clean, professional 4-color palette designed for healthcare applications
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div>
              <Image src="/healui-logo.png" alt="HealUI Logo" width={120} height={120} style={{ margin: '0 auto 1rem' }} />
              <div className="lk-typography-title-medium mb-sm">4-Color Professional Palette</div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                Black (#000000), Deep Blue (#1e607a), Light Teal (#c8eaeb), Light Blue (#eff8ff)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="bg-surface p-lg">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="lk-typography-headline-large mb-md">Color Palette</div>
          
          {/* New Color Palette Display */}
          <div className="mb-lg">
            <div className="lk-typography-title-large mb-sm">Core Color Palette</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#000000', borderRadius: '0.5rem' }} className="p-md">
                <div style={{ color: '#ffffff' }} className="lk-typography-body-medium">Pure Black</div>
                <div style={{ color: '#ffffff' }} className="lk-typography-label-small">#000000</div>
                <div style={{ color: '#ffffff', opacity: '0.8' }} className="lk-typography-label-small">Text & Emphasis</div>
              </div>
              <div style={{ backgroundColor: '#1e607a', borderRadius: '0.5rem' }} className="p-md">
                <div style={{ color: '#ffffff' }} className="lk-typography-body-medium">Deep Blue</div>
                <div style={{ color: '#ffffff' }} className="lk-typography-label-small">#1e607a</div>
                <div style={{ color: '#ffffff', opacity: '0.8' }} className="lk-typography-label-small">Primary Actions</div>
              </div>
              <div style={{ backgroundColor: '#c8eaeb', borderRadius: '0.5rem' }} className="p-md">
                <div style={{ color: '#000000' }} className="lk-typography-body-medium">Light Teal</div>
                <div style={{ color: '#000000' }} className="lk-typography-label-small">#c8eaeb</div>
                <div style={{ color: '#000000', opacity: '0.7' }} className="lk-typography-label-small">Containers</div>
              </div>
              <div style={{ backgroundColor: '#eff8ff', borderRadius: '0.5rem', border: '1px solid #1e607a' }} className="p-md">
                <div style={{ color: '#000000' }} className="lk-typography-body-medium">Light Blue</div>
                <div style={{ color: '#000000' }} className="lk-typography-label-small">#eff8ff</div>
                <div style={{ color: '#000000', opacity: '0.7' }} className="lk-typography-label-small">Backgrounds</div>
              </div>
            </div>
          </div>

          {/* Liftkit Color Variables */}
          <div className="mb-lg">
            <div className="lk-typography-title-large mb-sm">Liftkit Implementation</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="bg-primary p-md" style={{ borderRadius: '0.5rem' }}>
                <div style={{ color: 'var(--lk-onprimary)' }} className="lk-typography-body-medium">Primary</div>
                <div style={{ color: 'var(--lk-onprimary)' }} className="lk-typography-label-small">#1e607a</div>
              </div>
              <div className="bg-primarycontainer p-md" style={{ borderRadius: '0.5rem' }}>
                <div style={{ color: 'var(--lk-onprimarycontainer)' }} className="lk-typography-body-medium">Primary Container</div>
                <div style={{ color: 'var(--lk-onprimarycontainer)' }} className="lk-typography-label-small">#c8eaeb</div>
              </div>
              <div className="bg-tertiary p-md" style={{ borderRadius: '0.5rem' }}>
                <div style={{ color: 'var(--lk-ontertiary)' }} className="lk-typography-body-medium">Tertiary (Black)</div>
                <div style={{ color: 'var(--lk-ontertiary)' }} className="lk-typography-label-small">#000000</div>
              </div>
              <div className="bg-secondarycontainer p-md" style={{ borderRadius: '0.5rem', border: '1px solid var(--lk-outline)' }}>
                <div style={{ color: 'var(--lk-onsecondarycontainer)' }} className="lk-typography-body-medium">Background</div>
                <div style={{ color: 'var(--lk-onsecondarycontainer)' }} className="lk-typography-label-small">#eff8ff</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Component Examples */}
      <div className="bg-surfacevariant p-lg">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="lk-typography-headline-large mb-md">Component Examples</div>
          
          {/* Buttons */}
          <div className="mb-lg">
            <div className="lk-typography-title-large mb-sm">Buttons - All Variants</div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="display-flex gap-sm" style={{ flexWrap: 'wrap' }}>
                <Button variant="fill" size="lg" label="Primary Action" />
                <Button variant="fill" size="md" label="Primary Action" />
                <Button variant="fill" size="sm" label="Primary Action" />
              </div>
              <div className="display-flex gap-sm" style={{ flexWrap: 'wrap' }}>
                <Button variant="outline" size="lg" label="Secondary Action" />
                <Button variant="outline" size="md" label="Secondary Action" />
                <Button variant="outline" size="sm" label="Secondary Action" />
              </div>
              <div className="display-flex gap-sm" style={{ flexWrap: 'wrap' }}>
                <Button variant="text" size="lg" label="Tertiary Action" />
                <Button variant="text" size="md" label="Tertiary Action" />
                <Button variant="text" size="sm" label="Tertiary Action" />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-lg">
            <div className="lk-typography-title-large mb-sm">Service Cards - New Professional Colors</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <ServiceCard
                icon={<Home />}
                title="Home Visits"
                description="Deep blue primary creates trust and professionalism in healthcare"
                color="primary"
                variant="fill"
              />
              <ServiceCard
                icon={<Users />}
                title="Expert Team"
                description="Light teal containers provide gentle, calming healthcare atmosphere"
                color="secondary"
                variant="outline"
              />
              <ServiceCard
                icon={<Calendar />}
                title="Professional Care"
                description="Black emphasis creates strong contrast and medical authority"
                color="tertiary"
                variant="transparent"
              />
            </div>
          </div>

          {/* Therapist Card */}
          <div>
            <div className="lk-typography-title-large mb-sm">Therapist Profile Card</div>
            <div style={{ maxWidth: '400px' }}>
              <TherapistCard
                name="Dr. Sarah Johnson"
                title="Senior Physiotherapist"
                rating={4.9}
                reviewCount={127}
                experience="10+ years"
                specialization={['Sports Injuries', 'Post-Surgery Rehab']}
                availability="Mon-Fri, 9AM-6PM"
                location="Downtown Area"
                isVideoAvailable={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Examples */}
      <div className="bg-surface p-lg">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="lk-typography-headline-large mb-md">Typography Scale</div>
          <div className="lk-typography-body-large mb-lg" style={{ color: 'var(--lk-onsurfacevariant)' }}>
            Clean, professional typography in harmonious teal-gray tones
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="lk-typography-display-large">Display Large - Hero Headlines</div>
            <div className="lk-typography-display-medium">Display Medium - Section Headers</div>
            <div className="lk-typography-display-small">Display Small - Page Titles</div>
            <div className="lk-typography-headline-large">Headline Large - Primary Headings</div>
            <div className="lk-typography-headline-medium">Headline Medium - Secondary Headings</div>
            <div className="lk-typography-headline-small">Headline Small - Card Titles</div>
            <div className="lk-typography-title-large">Title Large - Section Labels</div>
            <div className="lk-typography-title-medium">Title Medium - Categories</div>
            <div className="lk-typography-title-small">Title Small - Tags</div>
            <div className="lk-typography-body-large">Body Large - Important descriptions and introductions</div>
            <div className="lk-typography-body-medium">Body Medium - Standard body text for readability</div>
            <div className="lk-typography-body-small">Body Small - Secondary information and details</div>
            <div className="lk-typography-label-large">Label Large - Button text</div>
            <div className="lk-typography-label-medium">Label Medium - Form labels</div>
            <div className="lk-typography-label-small">Label Small - Captions and metadata</div>
          </div>
        </div>
      </div>

      {/* Design Principles */}
      <div className="bg-primarycontainer p-lg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="lk-typography-headline-large mb-md">Professional Healthcare Design Principles</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div>
              <div className="lk-typography-title-large mb-sm" style={{ color: 'var(--lk-primary)' }}>🏥 Authority & Trust</div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                Deep blue conveys medical authority and professional reliability
              </div>
            </div>
            <div>
              <div className="lk-typography-title-large mb-sm" style={{ color: '#1e607a' }}>💧 Calm & Clean</div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                Light teal creates a calming, hygienic healthcare environment
              </div>
            </div>
            <div>
              <div className="lk-typography-title-large mb-sm" style={{ color: 'var(--lk-tertiary)' }}>⚫ Clarity & Focus</div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                Pure black ensures maximum readability and professional clarity
              </div>
            </div>
            <div>
              <div className="lk-typography-title-large mb-sm" style={{ color: '#1e607a' }}>💙 Openness & Space</div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                Light blue backgrounds create open, breathable user experiences
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .service-cards-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (min-width: 1024px) {
          .service-cards-grid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}