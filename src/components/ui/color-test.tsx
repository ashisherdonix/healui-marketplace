'use client';

import Button from '@/components/button';
import Card from '@/components/card';
import { ServiceCard } from '@/components/ui/service-card';
import { Home, Users, Calendar, Heart } from 'lucide-react';

// Component to test the new color palette implementation
export default function ColorTest() {
  return (
    <div className="bg-background p-lg">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Color Palette Test */}
        <div className="mb-lg">
          <div className="lk-typography-headline-large mb-md">New Color Palette Test</div>
          
          {/* Raw Color Swatches */}
          <div className="mb-lg">
            <div className="lk-typography-title-large mb-sm">Raw Colors</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#000000', padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ color: '#ffffff' }} className="lk-typography-body-medium">#000000 - Black</div>
              </div>
              <div style={{ backgroundColor: '#1e607a', padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ color: '#ffffff' }} className="lk-typography-body-medium">#1e607a - Deep Blue</div>
              </div>
              <div style={{ backgroundColor: '#c8eaeb', padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ color: '#000000' }} className="lk-typography-body-medium">#c8eaeb - Light Teal</div>
              </div>
              <div style={{ backgroundColor: '#eff8ff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e607a' }}>
                <div style={{ color: '#000000' }} className="lk-typography-body-medium">#eff8ff - Light Blue</div>
              </div>
            </div>
          </div>

          {/* Liftkit CSS Variables Test */}
          <div className="mb-lg">
            <div className="lk-typography-title-large mb-sm">Liftkit CSS Variables</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="bg-primary p-md" style={{ borderRadius: '0.5rem' }}>
                <div style={{ color: 'var(--lk-onprimary)' }} className="lk-typography-body-medium">
                  bg-primary
                </div>
              </div>
              <div className="bg-primarycontainer p-md" style={{ borderRadius: '0.5rem' }}>
                <div style={{ color: 'var(--lk-onprimarycontainer)' }} className="lk-typography-body-medium">
                  bg-primarycontainer
                </div>
              </div>
              <div className="bg-tertiary p-md" style={{ borderRadius: '0.5rem' }}>
                <div style={{ color: 'var(--lk-ontertiary)' }} className="lk-typography-body-medium">
                  bg-tertiary (Black)
                </div>
              </div>
              <div className="bg-surface p-md" style={{ borderRadius: '0.5rem', border: '1px solid var(--lk-outline)' }}>
                <div style={{ color: 'var(--lk-onsurface)' }} className="lk-typography-body-medium">
                  bg-surface
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button Test */}
        <div className="mb-lg">
          <div className="lk-typography-headline-large mb-md">Button Color Test</div>
          
          {/* Primary Buttons */}
          <div className="mb-md">
            <div className="lk-typography-title-large mb-sm">Primary Color Buttons</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="fill" size="lg" label="Primary Fill" color="primary" />
              <Button variant="outline" size="lg" label="Primary Outline" color="primary" />
              <Button variant="text" size="lg" label="Primary Text" color="primary" />
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="mb-md">
            <div className="lk-typography-title-large mb-sm">Secondary Color Buttons</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="fill" size="lg" label="Secondary Fill" color="secondary" />
              <Button variant="outline" size="lg" label="Secondary Outline" color="secondary" />
              <Button variant="text" size="lg" label="Secondary Text" color="secondary" />
            </div>
          </div>

          {/* Tertiary Buttons */}
          <div className="mb-md">
            <div className="lk-typography-title-large mb-sm">Tertiary Color Buttons (Black)</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="fill" size="lg" label="Tertiary Fill" color="tertiary" />
              <Button variant="outline" size="lg" label="Tertiary Outline" color="tertiary" />
              <Button variant="text" size="lg" label="Tertiary Text" color="tertiary" />
            </div>
          </div>
        </div>

        {/* Service Cards Test */}
        <div className="mb-lg">
          <div className="lk-typography-headline-large mb-md">Service Cards Color Test</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <ServiceCard
              icon={<Home />}
              title="Primary Color Card"
              description="Testing primary color with deep blue (#1e607a) and light teal container (#c8eaeb)"
              color="primary"
              variant="fill"
            />
            <ServiceCard
              icon={<Users />}
              title="Secondary Color Card"
              description="Testing secondary color with same deep blue but light blue container (#eff8ff)"
              color="secondary"
              variant="outline"
            />
            <ServiceCard
              icon={<Calendar />}
              title="Tertiary Color Card"
              description="Testing tertiary color with pure black (#000000) for maximum emphasis"
              color="tertiary"
              variant="transparent"
            />
          </div>
        </div>

        {/* Card Variants Test */}
        <div className="mb-lg">
          <div className="lk-typography-headline-large mb-md">Card Variants Test</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <Card variant="fill">
              <div className="p-lg">
                <div className="lk-typography-title-large mb-sm">Fill Card</div>
                <div className="lk-typography-body-medium mb-md">
                  This card uses the fill variant with default surface colors.
                </div>
                <Button variant="fill" size="md" label="Action Button" />
              </div>
            </Card>
            
            <Card variant="outline">
              <div className="p-lg">
                <div className="lk-typography-title-large mb-sm">Outline Card</div>
                <div className="lk-typography-body-medium mb-md">
                  This card uses the outline variant with border styling.
                </div>
                <Button variant="outline" size="md" label="Action Button" />
              </div>
            </Card>
            
            <Card variant="transparent">
              <div className="p-lg">
                <div className="lk-typography-title-large mb-sm">Transparent Card</div>
                <div className="lk-typography-body-medium mb-md">
                  This card uses the transparent variant with minimal styling.
                </div>
                <Button variant="text" size="md" label="Action Button" />
              </div>
            </Card>
          </div>
        </div>

        {/* Typography Test */}
        <div className="mb-lg">
          <div className="lk-typography-headline-large mb-md">Typography Color Test</div>
          <div className="bg-surface p-lg" style={{ borderRadius: '0.5rem' }}>
            <div className="lk-typography-display-large mb-sm">Display Large - Default Color</div>
            <div className="lk-typography-headline-large mb-sm" style={{ color: 'var(--lk-primary)' }}>
              Headline Large - Primary Color (#1e607a)
            </div>
            <div className="lk-typography-title-large mb-sm" style={{ color: 'var(--lk-tertiary)' }}>
              Title Large - Tertiary Color (Black)
            </div>
            <div className="lk-typography-body-large mb-sm">
              Body Large - Default surface text color
            </div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
              Body Medium - Surface variant text color for secondary content
            </div>
          </div>
        </div>

        {/* Background Test */}
        <div className="mb-lg">
          <div className="lk-typography-headline-large mb-md">Background Color Test</div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="bg-background p-lg" style={{ borderRadius: '0.5rem', border: '1px solid var(--lk-outline)' }}>
              <div className="lk-typography-body-medium">
                bg-background: Main app background (#eff8ff)
              </div>
            </div>
            <div className="bg-surface p-lg" style={{ borderRadius: '0.5rem' }}>
              <div className="lk-typography-body-medium">
                bg-surface: Card and surface background (#ffffff)
              </div>
            </div>
            <div className="bg-surfacevariant p-lg" style={{ borderRadius: '0.5rem' }}>
              <div className="lk-typography-body-medium">
                bg-surfacevariant: Variant surface background (#c8eaeb)
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-primarycontainer p-lg" style={{ borderRadius: '0.5rem', textAlign: 'center' }}>
          <div className="lk-typography-title-large mb-sm" style={{ color: 'var(--lk-primary)' }}>
            ✅ New Color Palette Successfully Implemented!
          </div>
          <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
            All components are now using the professional 4-color healthcare palette with maximum Liftkit integration.
          </div>
        </div>

      </div>
    </div>
  );
}