export const THEME = {
  colors: {
    background: '#F7F9FA', // Clean, soft light background
    surface: '#FFFFFF',
    primary: '#1A1A1A', // Charcoal text for readability
    accent: '#58CC02', // Friendly green
    accentLight: '#EAF7E2', // Very soft green tint
    accentYellow: '#FFC800', // Highlight yellow
    accentCoral: '#FF4B4B', // Error/Badge red
    accentBlue: '#1CB0F6', // Chat blue
    userBubble: '#1CB0F6', // iOS style blue bubble
    userBubbleText: '#FFFFFF',
    aiBubble: '#F1F3F4', // Soft gray bubble
    aiBubbleText: '#1A1A1A',
    inputBackground: '#FFFFFF',
    placeholder: '#A0AAB2',
    headerBackground: '#FFFFFF',
    headerText: '#1A1A1A',
    chipBackground: '#F1F3F4',
    chipText: '#3C3C3C',
    cardBorder: '#E5E9EB', // Thin, elegant gray divider
    error: '#FF4B4B',
  },
  typography: {
    fontSizeSmall: 12,
    fontSizeBody: 15,
    fontSizeTitle: 18,
    fontSizeHeading: 22,
    fontSizeLarge: 28,
    fontWeightRegular: '400' as const,
    fontWeightMedium: '500' as const,
    fontWeightBold: '700' as const,
    fontWeightBlack: '900' as const,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borders: {
    width: 1,
    radius: 12, // Modern rounded corners
    color: '#E5E9EB',
  },
  shadows: {
    hard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  },
};
