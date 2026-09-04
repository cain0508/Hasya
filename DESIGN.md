---
name: Luminous Pulse
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4d4732'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7e775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#e9c400'
  secondary: '#5f5e5f'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e3'
  on-secondary-container: '#656465'
  tertiary: '#3856c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#d1d8ff'
  on-tertiary-container: '#3956c0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#e4e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474748'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b7c4ff'
  on-tertiary-fixed: '#001452'
  on-tertiary-fixed-variant: '#193ca7'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is built on a narrative of "Optimistic Vitality." It bridges the gap between high-performance Web3 technology and the gentle world of mental wellness. The target audience consists of digital natives who value transparency, gamification, and modern aesthetics over clinical traditionalism. 

The visual style is a hybrid of **Minimalism** and **Glassmorphism**, emphasizing "lightness" and "reward." By utilizing vibrant pops of Joyful Yellow against deep, trustworthy blues, the UI evokes a sense of progress and energy. Every interaction should feel like a small victory, using subtle motion and depth to make the user feel supported rather than monitored.

## Colors

This design system uses a high-contrast palette to drive engagement. **Joyful Yellow** is the primary driver of action, reserved for key CTAs, reward states, and progress indicators. **Deep Ethereum Blue** provides the grounding, used for core typography and structural elements to maintain a sense of professional reliability.

- **Primary (Joyful Yellow):** High-energy, used for motivation and "Earned" states.
- **Secondary (Deep Ethereum Blue):** The anchor, used for depth and contrast.
- **Tertiary (Protocol Blue):** A softer blue used for secondary actions and linking back to the Web3 aesthetic.
- **Surface:** Pure white (#FFFFFF) is used for the primary content cards to ensure a clean, airy feel, while the Neutral (#F8F9FA) is used for background layering.

## Typography

The typography strategy balances character with utility. **Plus Jakarta Sans** is used for headlines to provide a friendly, rounded, and welcoming tone. Its geometric nature aligns perfectly with the Web3 aesthetic. **Inter** is utilized for body text and labels to ensure maximum legibility, especially when displaying data or complex protocol information.

For mobile, headlines scale down to ensure content remains above the fold. Large display type should be used sparingly for "Reward" screens or milestone celebrations, often paired with Joyful Yellow for maximum impact.

## Layout & Spacing

The layout follows a **fluid grid** philosophy with generous white space to prevent cognitive overload. On desktop, a 12-column grid is used with a maximum container width of 1200px. On mobile, a 4-column grid with 20px side margins is standard.

Spacing follows an 8px rhythmic scale. Use `lg` (40px) and `xl` (64px) sections to create "breathing room" between major content blocks, reinforcing the feeling of "lightness." Horizontal padding in cards should be set to `md` (24px) to ensure content feels safe and enclosed.

## Elevation & Depth

The design system utilizes **Tonal Layers** combined with **Ambient Shadows** to create a sense of floating elements. 

- **Level 1 (Base):** Neutral background (#F8F9FA).
- **Level 2 (Cards):** Pure white surfaces with a soft, 15% opacity shadow, 20px blur, and a 4px Y-offset.
- **Level 3 (Modals/Popovers):** White surfaces with a more pronounced 20% opacity shadow and a 10px backdrop blur on the background layer to create a glassmorphic focus effect.

Avoid harsh black shadows; instead, tint shadows with a hint of the Secondary color (#3C3C3D) to keep them feeling integrated and modern.

## Shapes

The shape language is defined by the **Rounded (2)** setting, specifically utilizing "2xl" (1.5rem / 24px) corners for primary containers and cards. This extreme roundedness removes any visual "sharpness," contributing to the friendly and approachable mood of the app. Smaller elements like buttons and chips should follow this proportionally, maintaining a soft, pill-like appearance that feels tactile and rewarding to tap.

## Components

- **Buttons:** Primary buttons use Joyful Yellow with Deep Ethereum Blue text. They should have a subtle "lift" on hover. Secondary buttons use a ghost style with a 2px Deep Ethereum Blue border.
- **Chips/Badges:** Used for "Tokens Earned" or "Mood Tags." These should be pill-shaped with light tints of the primary color (e.g., 10% opacity Joyful Yellow background with 100% opacity text).
- **Cards:** White background, 24px rounded corners, and a soft ambient shadow. Cards should never have borders; depth is defined by elevation alone.
- **Inputs:** Soft gray backgrounds (#F1F3F5) with 12px rounded corners. On focus, the border should transition to Joyful Yellow.
- **Progress Bars:** Use a thick, 12px height with a rounded track. The progress fill should be a gradient from Joyful Yellow to an even brighter gold to signify energy.
- **Rewards/Incentives:** High-gloss icons and glassmorphic overlays should be used when a user completes a task, creating a "Web3 wallet" style notification that feels premium and celebratory.