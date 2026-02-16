/**
 * Bloom Design System — Color Palette
 *
 * Vibrant-yet-soothing pastels mapped to feature domains.
 * Every raw color is exported AND re-exported via semantic aliases.
 */

export const palette = {
  // ── Primary pastels ──────────────────────────────
  mintGreen: '#A8E6CF', // Health / Care
  mintGreenLight: '#D4F5E6',
  mintGreenDark: '#6CC99E',

  sunnyYellow: '#FFD93D', // Tips / Academy
  sunnyYellowLight: '#FFEC8B',
  sunnyYellowDark: '#E6BE00',

  softCoral: '#FF8B94', // Memories / Rewind
  softCoralLight: '#FFB7BD',
  softCoralDark: '#E06670',

  lavender: '#C3AED6', // Badges / Gamification
  lavenderLight: '#E1D5EC',
  lavenderDark: '#9B7FB8',

  skyBlue: '#87CEEB', // Informational / Neutral accent
  skyBlueLight: '#B8E4F7',
  skyBlueDark: '#5AAFCF',

  // ── Neutrals ──────────────────────────────────────
  white: '#FFFFFF',
  offWhite: '#FAFBFC',
  cream: '#FFF9F0',
  grey50: '#F8F9FA',
  grey100: '#F1F3F5',
  grey200: '#E9ECEF',
  grey300: '#DEE2E6',
  grey400: '#CED4DA',
  grey500: '#ADB5BD',
  grey600: '#868E96',
  grey700: '#495057',
  grey800: '#343A40',
  grey900: '#212529',
  black: '#000000',

  // ── Semantic / feedback ──────────────────────────
  success: '#51CF66',
  warning: '#FFC078',
  error: '#FF6B6B',
  info: '#74C0FC',
} as const;

/** Semantic color map used throughout the app */
export const colors = {
  primary: palette.mintGreen,
  primaryLight: palette.mintGreenLight,
  primaryDark: palette.mintGreenDark,

  secondary: palette.sunnyYellow,
  secondaryLight: palette.sunnyYellowLight,
  secondaryDark: palette.sunnyYellowDark,

  accent: palette.softCoral,
  accentLight: palette.softCoralLight,
  accentDark: palette.softCoralDark,

  badge: palette.lavender,
  badgeLight: palette.lavenderLight,
  badgeDark: palette.lavenderDark,

  background: palette.offWhite,
  card: palette.white,
  surface: palette.grey50,
  border: palette.grey200,

  text: palette.grey900,
  textSecondary: palette.grey600,
  textTertiary: palette.grey400,
  textInverse: palette.white,

  tabBar: palette.white,
  tabBarActive: palette.mintGreenDark,
  tabBarInactive: palette.grey400,

  ...palette, // also expose raw values
} as const;

export type ColorToken = keyof typeof colors;
