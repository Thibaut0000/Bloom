/**
 * Academy — "Learn" Tab
 *
 * Duolingo-style gamified learning path with badges.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LearningPath } from '@/src/components/academy/LearningPath';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBloomStore } from '@/src/store';

// ── Badge data ─────────────────────────────────────
const BADGES = [
  { id: 'sleep-master', label: '🌙 Sleep Master', earned: true },
  { id: 'nutrition-pro', label: '🥦 Nutrition Pro', earned: true },
  { id: 'safety-star', label: '⭐ Safety Star', earned: false },
  { id: 'play-champion', label: '🏆 Play Champion', earned: false },
];

export default function AcademyScreen() {
  const insets = useSafeAreaInsets();
  const { completedModules } = useBloomStore();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={styles.title}>Academy 🎓</Text>
        <Text style={styles.subtitle}>
          {completedModules.length} modules completed • Keep going!
        </Text>
      </Animated.View>

      {/* Badges Row */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Text style={styles.sectionTitle}>Your Badges</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeRow}
        >
          {BADGES.map((badge) => (
            <Card
              key={badge.id}
              bg={badge.earned ? colors.sunnyYellowLight : colors.grey100}
              shadow={badge.earned ? 'md' : 'sm'}
              radius="xl"
              style={styles.badgeCard}
            >
              <Text style={styles.badgeEmoji}>
                {badge.earned ? badge.label.split(' ')[0] : '🔒'}
              </Text>
              <Text
                style={[
                  styles.badgeLabel,
                  !badge.earned && styles.badgeLabelLocked,
                ]}
                numberOfLines={2}
              >
                {badge.earned ? badge.label.slice(badge.label.indexOf(' ') + 1) : 'Locked'}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Learning Path */}
      <Animated.View entering={FadeInDown.delay(350).springify()}>
        <Text style={styles.sectionTitle}>Learning Path</Text>
        <LearningPath />
      </Animated.View>

      <View style={{ height: spacing['6xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  badgeRow: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  badgeCard: {
    width: 90,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeLabel: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  badgeLabelLocked: {
    color: colors.grey400,
  },
});
