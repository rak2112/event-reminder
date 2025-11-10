// Dark modern color palette for Family Hub
export const colors = {
  // Dark backgrounds
  dark: {
    900: '#0a0a0f',
    800: '#1a1a2e',
    700: '#16213e',
    600: '#1f2937',
    500: '#374151',
    400: '#4b5563',
    300: '#6b7280',
    200: '#9ca3af',
    100: '#d1d5db',
    50: '#f3f4f6',
  },

  // Mint/Teal accent (for calm events)
  mint: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Coral/Salmon accent (for important events)
  coral: {
    50: '#fff4ed',
    100: '#ffe4d5',
    200: '#ffc9aa',
    300: '#ffa574',
    400: '#ff7a3c',
    500: '#f4a261',
    600: '#e76f51',
    700: '#d65a3b',
    800: '#b84927',
    900: '#9a3b1f',
  },

  // Sky blue accent
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Success - Fresh Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - Modern Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

// Semantic color tokens for dark theme
export const semanticColors = {
  text: {
    primary: '#ffffff',
    secondary: colors.dark[100],
    tertiary: colors.dark[200],
    inverse: colors.dark[900],
    disabled: colors.dark[400],
    muted: colors.dark[300],
  },

  border: {
    light: colors.dark[600],
    medium: colors.dark[500],
    dark: colors.dark[400],
  },

  background: {
    primary: colors.dark[900],
    secondary: colors.dark[800],
    tertiary: colors.dark[700],
    card: colors.dark[800],
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  interactive: {
    mintPrimary: colors.mint[500],
    mintHover: colors.mint[400],
    coralPrimary: colors.coral[500],
    coralHover: colors.coral[400],
    skyPrimary: colors.sky[500],
    skyHover: colors.sky[400],
    disabled: colors.dark[600],
  }
};

export default { colors, semanticColors };
