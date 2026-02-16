/**
 * <Badge /> — Gamification badge pill
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/src/theme/colors';
import { radii, spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export function Badge({
  label,
  color = colors.text,
  bg = colors.primaryLight,
  style,
  icon,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    ...typography.caption,
  },
});
