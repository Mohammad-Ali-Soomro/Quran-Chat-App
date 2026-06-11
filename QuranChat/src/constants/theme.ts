export const THEME = {
  colors: {
    background: '#FAFAF0',       // warm off-white
    surface: '#FFFFFF',
    primary: '#0D0D0D',          // near-black for borders and text
    accent: '#1B6B3A',           // deep Islamic green (used sparingly)
    userBubble: '#0D0D0D',       // user message background
    userBubbleText: '#FAFAF0',
    aiBubble: '#FFFFFF',         // AI message background
    aiBubbleText: '#0D0D0D',
    inputBackground: '#FFFFFF',
    placeholder: '#888888',
    headerBackground: '#0D0D0D',
    headerText: '#FAFAF0',
    error: '#D62828',
  },

  typography: {
    fontSizeSmall: 12,
    fontSizeBody: 15,
    fontSizeTitle: 18,
    fontSizeHeading: 22,
    fontWeightRegular: '400' as const,
    fontWeightBold: '700' as const,
    fontWeightBlack: '900' as const,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borders: {
    width: 2,
    radius: 0,       // Neobrutalism uses 0 or near-0 radius
    color: '#0D0D0D',
  },

  shadows: {
    // Neobrutalism hard shadow (offset, not blur)
    hard: {
      shadowColor: '#0D0D0D',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,   // android
    },
  },
};
