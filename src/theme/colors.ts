/**
 * Enterprise-grade color theme system
 * Centralized color definitions for consistent branding and accessibility
 */

export const THEME_COLORS = {
  // Primary colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Gray colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Success colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#145231",
  },

  // Danger/Error colors
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Warning/Caution colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Neutral/Background colors
  background: {
    light: "#ffffff",
    lighter: "#f9fafb",
    dark: "#16171d",
  },

  // Text colors
  text: {
    primary: "#111827",
    secondary: "#374151",
    tertiary: "#6b7280",
    inverse: "#ffffff",
  },

  // Border colors
  border: {
    light: "#e5e7eb",
    medium: "#d1d5db",
    dark: "#9ca3af",
  },

  // Shadow colors
  shadow: "rgba(0, 0, 0, 0.05)",
} as const;

// CSS variables for use in components
export const generateThemeCSSVariables = (): string => {
  return `
    --color-primary: ${THEME_COLORS.primary[600]};
    --color-primary-hover: ${THEME_COLORS.primary[700]};
    --color-primary-light: ${THEME_COLORS.primary[50]};
    
    --color-secondary: ${THEME_COLORS.gray[200]};
    --color-secondary-hover: ${THEME_COLORS.gray[300]};
    
    --color-success: ${THEME_COLORS.success[600]};
    --color-success-hover: ${THEME_COLORS.success[700]};
    
    --color-danger: ${THEME_COLORS.danger[600]};
    --color-danger-hover: ${THEME_COLORS.danger[700]};
    
    --color-warning: ${THEME_COLORS.warning[600]};
    
    --color-text-primary: ${THEME_COLORS.text.primary};
    --color-text-secondary: ${THEME_COLORS.text.secondary};
    --color-text-tertiary: ${THEME_COLORS.text.tertiary};
    --color-text-inverse: ${THEME_COLORS.text.inverse};
    
    --color-background: ${THEME_COLORS.background.light};
    --color-background-secondary: ${THEME_COLORS.gray[50]};
    
    --color-border: ${THEME_COLORS.border.light};
    --color-border-secondary: ${THEME_COLORS.border.medium};
    
    --color-shadow: ${THEME_COLORS.shadow};
  `;
};
