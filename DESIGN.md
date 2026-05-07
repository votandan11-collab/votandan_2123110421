---
name: Votandan
description: Premium Card Top-up & Loyalty Marketplace
colors:
  primary: "#6366f1"
  secondary: "#a855f7"
  accent: "#f43f5e"
  neutral-bg: "#020617"
  neutral-text: "#f8fafc"
  neutral-muted: "#94a3b8"
  glass-bg: "rgba(255, 255, 255, 0.03)"
  glass-border: "rgba(255, 255, 255, 0.08)"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "24px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-glass:
    backgroundColor: "{colors.glass-bg}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Votandan

## 1. Overview

**Creative North Star: "The Neon Observatory"**

Votandan uses a high-contrast dark aesthetic that blends futuristic digital elements with premium, tactile surfaces. The system relies on atmospheric depth created through radial gradients, backdrop blurs (glassmorphism), and neon-tinted accents. It explicitly rejects the flat, "safe" look of 2010s SaaS tools in favor of a bold, immersive experience.

**Key Characteristics:**
- Deep indigo/black foundations with vibrant purple/pink accents.
- Soft, glowing borders and surface elevations.
- High-impact typography with tight letter-spacing.
- Micro-interactions that feel responsive and "alive".

## 2. Colors

The palette is rooted in deep space neutrals, punctuated by energetic brand signals.

### Primary
- **Indigo Pulse** (#6366f1): The primary brand signal, used for main actions and focus states.

### Secondary
- **Violet Glow** (#a855f7): Used for secondary accents and gradients.

### Accent
- **Rose Flare** (#f43f5e): Reserved for high-priority alerts or distinctive highlights.

### Neutral
- **Space Black** (#020617): The foundation of all screens.
- **Star White** (#f8fafc): Canonical text color for readability.
- **Nebula Slate** (#94a3b8): Used for secondary text and muted information.

**The Rare Accent Rule.** The primary Indigo Pulse is used on ≤10% of any given screen. Its rarity is what gives the interface its premium, focused feel.

## 3. Typography

**Display Font:** Inter (Google Fonts)
**Body Font:** Inter (Google Fonts)

**Character:** A singular, versatile sans-serif that shifts from heavy, aggressive display weights to clean, legible body weights.

### Hierarchy
- **Display** (900, 4.5rem, 1.1): Used for hero headlines and high-impact messaging.
- **Headline** (800, 2.5rem, 1.2): Used for primary section titles.
- **Body** (400, 1rem, 1.6): Used for all descriptive text. Max line length: 70ch.

## 4. Elevation

The system uses "Atmospheric Depth" rather than traditional material shadows. Depth is conveyed through tonal layering and translucency.

**The Glass-First Rule.** Surfaces are never opaque unless necessary for accessibility. All containers use glassmorphism with backdrop-blur (12px–20px) to maintain a sense of environment.

## 5. Components

### Buttons
- **Shape:** Rounded (16px)
- **Primary:** Indigo Pulse background with a subtle glow shadow on hover.
- **Hover / Focus:** 0.3s transition; 2px vertical lift; increased glow.

### Cards / Containers
- **Corner Style:** Large (20px–24px)
- **Background:** Semi-transparent Space Black (0.4 alpha) with glass-border.
- **Shadow Strategy:** Subtle ambient shadows (rgba 0,0,0,0.4) combined with internal border glow.

## 6. Do's and Don'ts

### Do:
- **Do** use OKLCH for all new color declarations to ensure perceptual uniformity.
- **Do** use `backdrop-filter: blur(20px)` on all modal and sidebar backgrounds.
- **Do** use uppercase and letter-spacing (0.05em) for labels and small buttons.

### Don't:
- **Don't** use pure black (#000) or pure white (#fff).
- **Don't** use side-stripe borders as card accents.
- **Don't** use standard "Modal" windows when an inline "Glass Card" entrance will suffice.
- **Don't** use gradients on text.
