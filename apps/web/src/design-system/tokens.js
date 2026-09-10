/**
 * CRM OS Design System Tokens
 * Original, high-density, calm, and intelligent visual design tokens.
 * Inspired by modern standards (Linear, Stripe, Raycast, Vercel) without cloning.
 */

export const tokens = {
  // Brand & Accent Colors
  colors: {
    // Primary Brand: Electric Sapphire / Indigo
    brand: {
      50: '#f0f4fe',
      100: '#dce5fd',
      200: '#bfd1fb',
      300: '#94b3f8',
      400: '#628ef3',
      500: '#3b6bec',
      600: '#2552df',
      700: '#1d3fb6',
      800: '#1c3592',
      900: '#1b2f74',
      950: '#101c47',
    },

    // AI & Autonomous Agents: Violet / Cyan Glow
    ai: {
      light: '#f5f3ff',
      border: '#ddd6fe',
      glow: '#8b5cf6',
      text: '#6d28d9',
      darkSurface: '#1e1b4b',
      darkBorder: '#4338ca',
      cyan: '#06b6d4',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
    },

    // Neutral Surfaces & Canvas (Engineered for dark & light mode comfort)
    canvas: {
      light: '#f8fafc',
      dark: '#090d16',
    },
    surface: {
      light: '#ffffff',
      lightSubtle: '#f1f5f9',
      dark: '#0f172a',
      darkSubtle: '#1e293b',
      darkGlass: 'rgba(15, 23, 42, 0.75)',
      lightGlass: 'rgba(255, 255, 255, 0.85)',
    },
    border: {
      light: '#e2e8f0',
      lightSubtle: '#f1f5f9',
      dark: '#1e293b',
      darkSubtle: '#334155',
    },
    text: {
      primaryLight: '#0f172a',
      secondaryLight: '#475569',
      mutedLight: '#94a3b8',
      primaryDark: '#f8fafc',
      secondaryDark: '#cbd5e1',
      mutedDark: '#64748b',
    },

    // Semantic Status Tokens
    semantic: {
      success: {
        bgLight: '#ecfdf5',
        borderLight: '#a7f3d0',
        textLight: '#047857',
        bgDark: '#064e3b',
        textDark: '#34d399',
      },
      warning: {
        bgLight: '#fffbeb',
        borderLight: '#fde68a',
        textLight: '#b45309',
        bgDark: '#78350f',
        textDark: '#fbbf24',
      },
      error: {
        bgLight: '#fef2f2',
        borderLight: '#fecaca',
        textLight: '#b91c1c',
        bgDark: '#7f1d1d',
        textDark: '#f87171',
      },
      info: {
        bgLight: '#f0f9ff',
        borderLight: '#bae6fd',
        textLight: '#0369a1',
        bgDark: '#0c4a6e',
        textDark: '#38bdf8',
      },
    },
  },

  // Typography Scales & Font Weights
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace",
      display: "'Plus Jakarta Sans', 'Inter', sans-serif",
    },
    sizes: {
      hero: ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.035em' }],
      h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
      h2: ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
      h3: ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
      body: ['0.875rem', { lineHeight: '1.5' }],
      data: ['0.8125rem', { lineHeight: '1.4' }],
      caption: ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.01em' }],
      micro: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.04em' }],
    },
  },

  // Spacing & Grid System (4px baseline)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // Container Radii
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  // Ambient Shadows
  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
    elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    command: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px -2px rgba(99, 102, 241, 0.25)',
  },

  // Motion Durations & Spring Easings
  motion: {
    duration: {
      instant: '100ms',
      micro: '150ms',
      base: '250ms',
      gentle: '350ms',
      deliberate: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.16, 1, 0.3, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: { type: 'spring', damping: 25, stiffness: 300 },
    },
  },
};

export default tokens;
