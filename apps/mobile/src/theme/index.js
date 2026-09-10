import { COLORS } from '../constants/colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  display: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  h1: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  h2: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
  bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 17 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, lineHeight: 16 },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const THEME = {
  light: {
    background: COLORS.neutral[50],
    card: '#FFFFFF',
    text: COLORS.neutral[900],
    subtext: COLORS.neutral[500],
    border: COLORS.neutral[200],
    primary: COLORS.primary[600],
    accent: COLORS.primary[500],
    statusBg: COLORS.neutral[100],
  },
  dark: {
    background: COLORS.neutral[900],
    card: COLORS.neutral[800],
    text: COLORS.neutral[50],
    subtext: COLORS.neutral[400],
    border: COLORS.neutral[700],
    primary: COLORS.primary[500],
    accent: COLORS.primary[400],
    statusBg: COLORS.neutral[800],
  }
};
