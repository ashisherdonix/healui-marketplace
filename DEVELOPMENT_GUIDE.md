# HealUI Development Guide: Liftkit, Tailwind & shadcn Analysis

## 📊 Current State Analysis

### 1. **Liftkit Setup** ✅ READY
- **Version**: @chainlift/liftkit@0.2.0 (installed as devDependency)
- **Components Available**: Button, Card, Icon, StateLayer, MaterialLayer
- **CSS System**: Comprehensive utility classes in `/src/lib/css/`
- **Usage Pattern**: Data attributes + CSS classes
- **Command**: `npm run add` to add new components

#### Liftkit Component Structure:
```typescript
// Example: Button Component
<Button 
  variant="fill|outline|text"
  size="sm|md|lg"
  color="primary|secondary|tertiary"
  label="Button Text"
  startIcon="IconName"
  endIcon="IconName"
/>
```

#### Liftkit CSS Classes:
- Layout: `display-flex`, `align-items-center`, `gap-sm`
- Typography: `lk-typography-headline-large`, `lk-typography-body-medium`
- Colors: `bg-primary`, `color-primary`, `bg-surface`
- Spacing: `p-lg`, `m-md`, `mb-sm`
- Responsive: Mobile-first with custom media queries

### 2. **Tailwind CSS** ⚠️ PARTIALLY CONFIGURED
- **Version**: tailwindcss@4.1.13 (v4 - latest experimental version)
- **Config**: Basic configuration exists but not integrated with PostCSS
- **Usage**: Currently NOT being used in components
- **Issue**: Tailwind classes are not being compiled/applied

#### Current Tailwind Config:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', ...],
  theme: {
    extend: {
      colors: {
        primary: { /* HealUI-Learn colors */ },
        secondary: { /* Teal palette */ },
        // ... other colors
      }
    }
  }
}
```

### 3. **shadcn/ui** ❌ NOT INSTALLED
- **Status**: Not set up, but `components.json` exists
- **Config File**: Present with basic configuration
- **UI Components**: None installed yet
- **Utils**: No `cn()` utility function

#### Existing components.json:
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## 🏗️ Code Structure Analysis

### Project Organization:
```
src/
├── app/                    # Next.js 15 app directory
│   ├── page.tsx           # Homepage (using Liftkit)
│   ├── design-system/     # Design system showcase
│   └── globals.css        # Global styles + Liftkit overrides
├── components/            
│   ├── button/            # Liftkit button component
│   ├── card/              # Liftkit card component
│   └── ui/                # Custom components
│       ├── service-card.tsx
│       └── therapist-card.tsx
├── lib/
│   ├── css/              # Liftkit CSS utilities
│   ├── colorUtils.ts     # Color manipulation
│   └── utilities.ts      # Helper functions
└── styles/
    └── design-tokens.ts  # Design system tokens
```

### Current Implementation Patterns:

#### 1. **Pure Liftkit Pattern** (Currently Used):
```tsx
<div className="bg-surface p-lg">
  <div className="display-flex align-items-center gap-sm">
    <span className="lk-typography-headline-large">Title</span>
  </div>
</div>
```

#### 2. **Inline Styles for Custom Properties**:
```tsx
<div style={{ 
  maxWidth: '1200px', 
  margin: '0 auto',
  borderRadius: '1rem' 
}}>
```

## 🚀 Recommendations & Setup Guide

### Option 1: Continue with Pure Liftkit (RECOMMENDED)
**Pros:**
- Already working and configured
- Consistent design system
- Material Design 3 principles
- No additional setup needed

**Usage:**
```tsx
import Button from '@/components/button'
import Card from '@/components/card'

// Use Liftkit components and utilities
<Card variant="fill">
  <div className="p-lg">
    <h2 className="lk-typography-headline-medium">Title</h2>
    <Button variant="fill" size="md" label="Action" />
  </div>
</Card>
```

### Option 2: Enable Tailwind CSS Integration
**Steps to enable:**

1. **Install PostCSS dependencies**:
```bash
npm install -D postcss autoprefixer
```

2. **Create postcss.config.js**:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. **Update globals.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep existing Liftkit imports below */
@import "@/lib/css/index.css";
```

4. **Usage with Liftkit**:
```tsx
// Mix Tailwind utilities with Liftkit
<div className="bg-surface p-lg md:flex md:items-center">
  <h2 className="lk-typography-headline-medium text-center md:text-left">
    Title
  </h2>
</div>
```

### Option 3: Add shadcn/ui Components
**Steps to add:**

1. **Install dependencies**:
```bash
npm install -D @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

2. **Create utils file**:
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

3. **Install shadcn components**:
```bash
npx shadcn@latest add button card
```

4. **Usage with Liftkit**:
```tsx
// Use shadcn for complex components, Liftkit for layout
import { Button as ShadcnButton } from "@/components/ui/button"
import { Card as LiftkitCard } from "@/components/card"

<LiftkitCard variant="fill">
  <ShadcnButton variant="default">Click me</ShadcnButton>
</LiftkitCard>
```

## 🎯 Best Practices for Current Setup

### 1. **Component Creation Pattern**:
```tsx
// Use Liftkit components as base
import Card from '@/components/card'
import Button from '@/components/button'

export function FeatureCard({ title, description, action }) {
  return (
    <Card variant="fill">
      <div className="p-lg">
        <h3 className="lk-typography-headline-small mb-sm">{title}</h3>
        <p className="lk-typography-body-medium mb-md">{description}</p>
        <Button variant="outline" size="md" label={action} />
      </div>
    </Card>
  )
}
```

### 2. **Responsive Design Pattern**:
```tsx
// Mobile-first with inline styles + media queries
<div 
  className="p-md"
  style={{ 
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  }}
>
  {/* Content */}
</div>

// With custom CSS
<style jsx>{`
  @media (min-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr 1fr;
    }
  }
`}</style>
```

### 3. **Color System Usage**:
```tsx
// Use CSS variables for dynamic colors
<div 
  className="bg-primarycontainer"
  style={{ color: 'var(--lk-onprimarycontainer)' }}
>
  Content
</div>
```

### 4. **Typography Scale**:
```tsx
// Liftkit typography classes
<h1 className="lk-typography-display-large">Display</h1>
<h2 className="lk-typography-headline-large">Headline</h2>
<h3 className="lk-typography-title-large">Title</h3>
<p className="lk-typography-body-large">Body text</p>
<span className="lk-typography-label-medium">Label</span>
```

## 🔍 Current Issues & Solutions

### Issue 1: Tailwind Classes Not Working
**Solution**: Either continue with pure Liftkit or properly configure PostCSS as shown above.

### Issue 2: No shadcn Components
**Solution**: Not critical - Liftkit provides sufficient components. Add shadcn only if needed for complex UI patterns.

### Issue 3: Mixed Styling Approaches
**Solution**: Standardize on Liftkit utilities + inline styles for custom properties.

## 📝 Quick Reference

### Liftkit Utilities:
- **Flexbox**: `display-flex`, `align-items-center`, `justify-content-between`
- **Grid**: Use inline styles for grid layouts
- **Spacing**: `p-sm`, `p-md`, `p-lg`, `p-xl`, `m-*`, `gap-*`
- **Colors**: `bg-primary`, `bg-surface`, `bg-background`, `color-primary`
- **Typography**: `lk-typography-{scale}-{size}`
- **Responsive**: Custom media queries in `<style jsx>`

### Component Commands:
- Add Liftkit component: `npm run add <component-name>`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## 🎨 Design System Status

- ✅ **Color System**: HealUI-Learn colors implemented
- ✅ **Typography**: Full Liftkit typography scale
- ✅ **Components**: Button, Card, ServiceCard, TherapistCard
- ✅ **Layout System**: Flexbox utilities + custom grid
- ✅ **Responsive Design**: Mobile-first approach
- ⚠️ **Icons**: Using lucide-react (working but could add more)
- ❌ **Animations**: Not implemented yet
- ❌ **Form Components**: Need to add (input, select, etc.)

## Conclusion

You are **ready to code** with the current Liftkit setup. The system is functional and follows Material Design 3 principles. Tailwind and shadcn can be added later if needed, but Liftkit provides a complete solution for most UI needs.

**Recommended approach**: Continue with pure Liftkit + custom components pattern, as it's already working well and maintains consistency.