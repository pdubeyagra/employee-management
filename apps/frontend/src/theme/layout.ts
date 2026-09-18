export const LAYOUT_CONFIG = {
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "999px",
  },

  zIndex: {
    hide: "-1",
    base: "0",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modal: "1040",
    popover: "1050",
    tooltip: "1060",
  },

  fontSize: {
    xs: "12px",
    sm: "13px",
    base: "14px",
    md: "15px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px",
    "3xl": "24px",
    "4xl": "30px",
    "5xl": "36px",
  },

  lineHeight: {
    tight: "1.2",
    normal: "1.4",
    relaxed: "1.5",
    loose: "1.6",
  },

  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
  },

  transitions: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },

  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

export const generateLayoutCSSVariables = (): string => {
  const { spacing, radius, fontSize, lineHeight, shadows, transitions } =
    LAYOUT_CONFIG;

  return `

    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --spacing-2xl: ${spacing["2xl"]};
    --spacing-3xl: ${spacing["3xl"]};

    --radius-sm: ${radius.sm};
    --radius-md: ${radius.md};
    --radius-lg: ${radius.lg};
    --radius-full: ${radius.full};

    --font-size-xs: ${fontSize.xs};
    --font-size-sm: ${fontSize.sm};
    --font-size-base: ${fontSize.base};
    --font-size-md: ${fontSize.md};
    --font-size-lg: ${fontSize.lg};
    --font-size-xl: ${fontSize.xl};
    --font-size-2xl: ${fontSize["2xl"]};
    --font-size-3xl: ${fontSize["3xl"]};
    --font-size-4xl: ${fontSize["4xl"]};

    --line-height-tight: ${lineHeight.tight};
    --line-height-normal: ${lineHeight.normal};
    --line-height-relaxed: ${lineHeight.relaxed};
    --line-height-loose: ${lineHeight.loose};

    --shadow-sm: ${shadows.sm};
    --shadow-base: ${shadows.base};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
    --shadow-xl: ${shadows.xl};

    --transition-fast: ${transitions.fast};
    --transition-base: ${transitions.base};
    --transition-slow: ${transitions.slow};

    --z-hide: ${LAYOUT_CONFIG.zIndex.hide};
    --z-base: ${LAYOUT_CONFIG.zIndex.base};
    --z-dropdown: ${LAYOUT_CONFIG.zIndex.dropdown};
    --z-sticky: ${LAYOUT_CONFIG.zIndex.sticky};
    --z-modal: ${LAYOUT_CONFIG.zIndex.modal};
  `;
};
