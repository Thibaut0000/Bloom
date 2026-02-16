/**
 * Memories — "Rewind" Tab
 *
 * Photo/video timeline, Birthday Interview prompt, Rewind yearbook teaser.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressRing } from '@/src/components/ui/ProgressRing';
import { colors } from '@/src/theme/colors';
import { spacing, radii, shadows } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBloomStore } from '@/src/store';

// ── Mock memory data (when real photos are empty) ──
const MOCK_MEMORIES = [
  {
    id: 'm1',
    month: 'Jan 2026',
    items: [
      { id: 'p1', emoji: '🎂', caption: 'Birthday celebration!' },
      { id: 'p2', emoji: '❄️', caption: 'First snow day' },
    ],
  },
  {
    id: 'm2',
    month: 'Dec 2025',
    items: [
      { id: 'p3', emoji: '🎄', caption: 'Christmas morning' },
      { id: 'p4', emoji: '🎅', caption: 'Meeting Santa' },
      { id: 'p5', emoji: '🎁', caption: 'Opening presents' },
    ],
  },
  {
    id: 'm3',
    month: 'Nov 2025',
    items: [
      { id: 'p6', emoji: '🍂', caption: 'Autumn leaves' },
      { id: 'p7', emoji: '🦃', caption: 'Thanksgiving' },
    ],
  },
];

export default function MemoriesScreen() {
  const insets = useSafeAreaInsets();
  const { child } = useBloomStore();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={styles.title}>Memories 📸</Text>
        <Text style={styles.subtitle}>{child.name}'s precious moments</Text>
      </Animated.View>

      {/* ── Birthday Interview Card ─────────────── */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Card
          bg={colors.sunnyYellowLight}
          shadow="lg"
          radius="3xl"
          style={styles.interviewCard}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <View style={styles.interviewInner}>
            <View style={styles.interviewIcon}>
              <Ionicons name="videocam" size={28} color={colors.sunnyYellowDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Badge
                label="Birthday Interview"
                bg={colors.sunnyYellowDark}
                color={colors.white}
              />
              <Text style={styles.interviewTitle}>
                Ask {child.name}: What is your{'\n'}favorite toy? 🧸
              </Text>
              <Text style={styles.interviewBody}>
                Record a special video that becomes part of the Rewind Book.
              </Text>
            </View>
          </View>
          <View style={styles.recordButton}>
            <Ionicons name="radio-button-on" size={20} color={colors.white} />
            <Text style={styles.recordText}>Start Recording</Text>
          </View>
        </Card>
      </Animated.View>

      {/* ── The Rewind — Year Book Teaser ────────── */}
      <Animated.View entering={FadeInDown.delay(350).springify()}>
        <Card
          bg={colors.softCoralLight}
          shadow="md"
          radius="3xl"
          style={styles.rewindCard}
        >
          <View style={styles.rewindRow}>
            <ProgressRing
              progress={0.18}
              size={72}
              strokeWidth={5}
              color={colors.softCoralDark}
              trackColor={colors.softCoral}
            >
              <Text style={styles.rewindPercent}>18%</Text>
            </ProgressRing>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Text style={styles.rewindTitle}>📖 2026 Rewind Book</Text>
              <Text style={styles.rewindBody}>
                Your year book is generating... Add more photos & interviews to
                make it special!
              </Text>
              <Badge
                label="Coming soon"
                bg={colors.softCoralDark}
                color={colors.white}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* ── Memory Timeline ─────────────────────── */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <Text style={styles.sectionTitle}>Timeline</Text>
      </Animated.View>

      {MOCK_MEMORIES.map((group, gi) => (
        <Animated.View
          key={group.id}
          entering={FadeInDown.delay(550 + gi * 100).springify()}
        >
          <Text style={styles.monthLabel}>{group.month}</Text>
          <View style={styles.memoryGrid}>
            {group.items.map((item, ii) => (
              <Card
                key={item.id}
                bg={colors.white}
                shadow="sm"
                radius="xl"
                style={styles.memoryCard}
                onPress={() => Haptics.selectionAsync()}
              >
                <View style={styles.memoryPlaceholder}>
                  <Text style={styles.memoryEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.memoryCaption} numberOfLines={1}>
                  {item.caption}
                </Text>
              </Card>
            ))}
          </View>
        </Animated.View>
      ))}

      {/* Add memory CTA */}
      <Animated.View entering={FadeInUp.delay(800).springify()}>
        <Card
          bg={colors.grey100}
          shadow="sm"
          radius="2xl"
          style={styles.addMemoryCard}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Ionicons name="add-circle-outline" size={32} color={colors.grey400} />
          <Text style={styles.addMemoryText}>Add a new memory</Text>
        </Card>
      </Animated.View>

      <View style={{ height: spacing['6xl'] }} />
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  title: { ...typography.title, color: colors.text },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  // Interview card
  interviewCard: { padding: spacing.xl, marginBottom: spacing.lg },
  interviewInner: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  interviewIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.sunnyYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interviewTitle: {
    ...typography.subheading,
    color: colors.text,
    marginTop: spacing.sm,
  },
  interviewBody: {
    ...typography.bodySmall,
    color: colors.grey700,
    marginTop: spacing.xs,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.softCoral,
    borderRadius: radii.full,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  recordText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },

  // Rewind
  rewindCard: { padding: spacing.xl, marginBottom: spacing.sm },
  rewindRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewindTitle: { ...typography.subheading, color: colors.text },
  rewindBody: {
    ...typography.bodySmall,
    color: colors.grey700,
    marginTop: spacing.xs,
  },
  rewindPercent: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.softCoralDark,
  },

  // Timeline
  monthLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  memoryCard: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  memoryPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  memoryEmoji: { fontSize: 28 },
  memoryCaption: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
  },

  // Add memory
  addMemoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    marginTop: spacing.md,
  },
  addMemoryText: {
    ...typography.bodySmall,
    color: colors.grey400,
    marginTop: spacing.sm,
  },
});
