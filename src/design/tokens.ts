/**
 * LUME DESIGN SYSTEM - TOKENS
 * Premium educational SaaS design system
 * Inspired by: Notion, Linear, Duolingo, Stripe
 */

export const tokens = {
  // SPACING SCALE (4px base for precision)
  spacing: {
    '0': '0',
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
  },

  // RADIUS SCALE (Modern, not excessive)
  radius: {
    none: '0',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // SHADOWS (Subtle depth hierarchy)
  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    md: '0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
    lg: '0 8px 16px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.02)',
    xl: '0 16px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.02)',
    '2xl': '0 24px 48px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.03)',
    glow: '0 0 24px rgba(45,74,62,0.15)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },

  // GRADIENTS (Premium but not excessive)
  gradients: {
    primary: 'linear-gradient(135deg, #2D4A3E 0%, #1B3A4B 100%)',
    hero: 'linear-gradient(135deg, #1B3A4B 0%, #2D4A3E 100%)',
    success: 'linear-gradient(135deg, #27AE60 0%, #229954 100%)',
    warning: 'linear-gradient(135deg, #F39C12 0%, #D68910 100%)',
    danger: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
    premium: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    subtle: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0.01) 100%)',
  },

  // COLORS (WCAG AAA compliant)
  colors: {
    // Brand (Primary)
    brand: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#2D4A3E', // Primary (updated to darker green)
      600: '#27AE60',
      700: '#229954',
      800: '#1E8449',
      900: '#1B5E20',
    },
    
    // Neutrals (Refined gray scale)
    gray: {
      50: '#FAFBFC',
      100: '#F5F7FA',
      200: '#E4E7EB',
      300: '#CBD2D9',
      400: '#9AA5B1',
      500: '#7B8794',
      600: '#616E7C',
      700: '#52606D',
      800: '#3E4C59',
      900: '#323F4B',
      950: '#1F2933',
    },

    // Semantic colors
    success: {
      light: '#D4EDDA',
      DEFAULT: '#27AE60',
      dark: '#1E8449',
    },
    warning: {
      light: '#FFF3CD',
      DEFAULT: '#F39C12',
      dark: '#D68910',
    },
    danger: {
      light: '#F8D7DA',
      DEFAULT: '#E74C3C',
      dark: '#C0392B',
    },
    info: {
      light: '#D1ECF1',
      DEFAULT: '#3498DB',
      dark: '#2874A6',
    },
  },

  // TYPOGRAPHY (System fonts optimized for readability)
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      '2xs': '10px',
      xs: '12px',
      sm: '13px',
      base: '15px',
      lg: '17px',
      xl: '19px',
      '2xl': '22px',
      '3xl': '28px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px',
      '7xl': '80px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // TRANSITIONS (Smooth 60fps animations)
  transitions: {
    fastest: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: '600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Z-INDEX SCALE (Organized hierarchy)
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },

  // BREAKPOINTS (Mobile-first responsive)
  breakpoints: {
    xs: '360px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
    '3xl': '1920px',
  },

  // CONTAINER MAX WIDTHS
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    full: '100%',
  },

  // ICON SIZES (Consistent sizing)
  iconSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
  },

  // FOCUS RING (Accessibility)
  focusRing: {
    width: '2px',
    offset: '2px',
    color: '#3498DB',
    style: 'solid',
  },
};

// CSS Variables export for global injection
export const cssVariables = `
:root {
  /* Colors */
  --brand: #2D4A3E;
  --brand-light: #4A7A6A;
  --brand-dark: #1B3A4B;
  
  --success: #27AE60;
  --warning: #F39C12;
  --danger: #E74C3C;
  --info: #3498DB;
  
  --text-primary: #1F2933;
  --text-secondary: #52606D;
  --text-tertiary: #7B8794;
  --text-disabled: #9AA5B1;
  
  --bg: #FFFFFF;
  --bg-secondary: #FAFBFC;
  --bg-tertiary: #F5F7FA;
  
  --border: #E4E7EB;
  --border-light: #F5F7FA;
  --border-dark: #CBD2D9;
  
  --card-bg: #FFFFFF;
  --surface-raised: #FFFFFF;
  --overlay: rgba(31, 41, 51, 0.7);
  
  /* Spacing */
  --spacing-xs: ${tokens.spacing['1']};
  --spacing-sm: ${tokens.spacing['2']};
  --spacing-md: ${tokens.spacing['4']};
  --spacing-lg: ${tokens.spacing['6']};
  --spacing-xl: ${tokens.spacing['8']};
  
  /* Radius */
  --radius-xs: ${tokens.radius.xs};
  --radius-sm: ${tokens.radius.sm};
  --radius-md: ${tokens.radius.md};
  --radius-lg: ${tokens.radius.lg};
  --radius-xl: ${tokens.radius.xl};
  --radius-full: ${tokens.radius.full};
  
  /* Shadows */
  --shadow-xs: ${tokens.shadows.xs};
  --shadow-sm: ${tokens.shadows.sm};
  --shadow-md: ${tokens.shadows.md};
  --shadow-lg: ${tokens.shadows.lg};
  --shadow-xl: ${tokens.shadows.xl};
  --shadow-glow: ${tokens.shadows.glow};
  
  /* Transitions */
  --transition-fast: ${tokens.transitions.fast};
  --transition-base: ${tokens.transitions.base};
  --transition-slow: ${tokens.transitions.slow};
  
  /* Typography */
  --font-sans: ${tokens.typography.fontFamily.sans};
  --font-mono: ${tokens.typography.fontFamily.mono};
  
  /* Z-index */
  --z-dropdown: ${tokens.zIndex.dropdown};
  --z-sticky: ${tokens.zIndex.sticky};
  --z-modal: ${tokens.zIndex.modal};
  --z-tooltip: ${tokens.zIndex.tooltip};
  
  /* Container */
  --container-max: ${tokens.container['2xl']};
  
  /* Focus */
  --focus-ring: ${tokens.focusRing.width} ${tokens.focusRing.style} ${tokens.focusRing.color};
  --focus-ring-offset: ${tokens.focusRing.offset};
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #F5F7FA;
    --text-secondary: #CBD2D9;
    --text-tertiary: #9AA5B1;
    --text-disabled: #7B8794;
    
    --bg: #1F2933;
    --bg-secondary: #323F4B;
    --bg-tertiary: #3E4C59;
    
    --border: #52606D;
    --border-light: #3E4C59;
    --border-dark: #616E7C;
    
    --card-bg: #323F4B;
    --surface-raised: #3E4C59;
    --overlay: rgba(31, 41, 51, 0.9);
  }
}

/* Focus visible styles for accessibility */
*:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-sm);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
