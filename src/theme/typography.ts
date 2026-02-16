/**
 * Bloom Design System — Typography
 *
 * Playful yet readable type scale with custom font support.
 * Uses Inter (system) by default; can be swapped for a custom face.
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const fontFamilyBold = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

type TypoToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  fontFamily: string;
  letterSpacing?: number;
};

export const typography: Record<string, TypoToken> = {
  /** Big hero text – splash / celebration */
  hero: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    fontFamily: fontFamilyBold,
    letterSpacing: -0.5,
  },
  /** Section / page title */
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    fontFamily: fontFamilyBold,
    letterSpacing: -0.3,
  },
  /** Card title / sub-heading */
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: fontFamilyBold,
  },
  /** Section labels */
  subheading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: fontFamilyBold,
  },
  /** Default body text */
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily,
  },
  /** Secondary body text */
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily,
  },
  /** Labels, badges */
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily,
    letterSpacing: 0.2,
  },
  /** Tiny meta text */
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily,
    letterSpacing: 0.8,
  },
} as const;
