/**
 * Dashboard — "Today" Tab
 *
 * Bento-grid layout with:
 *  - Greeting header + child age
 *  - "Tip of the Day" hero card
 *  - Today's timeline
 *  - Quick stats row
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressRing } from '@/src/components/ui/ProgressRing';
import { colors } from '@/src/theme/colors';
import { spacing, radii } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBloomStore } from '@/src/store';
import { getGreeting, formatChildAge } from '@/src/utils/helpers';

const CARD_GAP = spacing.md;

// ── Tips pool (contextual by month) ────────────────
const TIPS = [
  {
    title: '🌙 Sleep Routine',
    body: 'A consistent bedtime routine helps toddlers fall asleep faster. Try bath → book → bed!',
    color: colors.lavenderLight,
    accent: colors.lavenderDark,
  },
  {
    title: '🥦 Veggie Power',
    body: 'Offer new vegetables 10-15 times before giving up. Toddlers need repeated exposure!',
    color: colors.mintGreenLight,
    accent: colors.mintGreenDark,
  },
  {
    title: '📚 Story Time',
    body: 'Reading 15 min/day boosts vocabulary by 1 million words per year. Start today!',
    color: colors.sunnyYellowLight,
    accent: colors.sunnyYellowDark,
  },
  {
    title: '🧸 Independent Play',
    body: 'Allow 20-30 min of solo play daily. It builds creativity and self-confidence.',
    color: colors.softCoralLight,
    accent: colors.softCoralDark,
  },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { parentName, child, todayEvents, toggleEvent, growthEntries, completedModules } =
    useBloomStore();

  const greeting = getGreeting();
  const childAge = formatChildAge(child.birthDate);
  const tipOfDay = TIPS[new Date().getDate() % TIPS.length];

  // Quick stats
  const doneCount = todayEvents.filter((e) => e.done).length;
  const latestWeight = growthEntries[growthEntries.length - 1]?.weightKg ?? '—';
  const modulesCount = completedModules.length;

  return (
    <ScrollView
      style={dashStyles.screen}
      contentContainerStyle={[dashStyles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ────────────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={dashStyles.greeting}>
          {greeting}, {parentName} 👋
        </Text>
        <Text style={dashStyles.childAge}>
          {child.name} is {childAge}
        </Text>
      </Animated.View>

      {/* ── Tip of the Day (Hero Card) ────────────── */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Card
          bg={tipOfDay.color}
          shadow="lg"
          radius="3xl"
          style={dashStyles.tipCard}
        >
          <Badge
            label="Tip of the Day"
            bg={tipOfDay.accent}
            color={colors.white}
          />
          <Text style={dashStyles.tipTitle}>{tipOfDay.title}</Text>
          <Text style={dashStyles.tipBody}>{tipOfDay.body}</Text>
        </Card>
      </Animated.View>

      {/* ── Quick Stats (Bento Row) ───────────────── */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={dashStyles.bentoRow}
      >
        <StatCard
          icon="checkmark-done"
          label="Done Today"
          value={`${doneCount}/${todayEvents.length}`}
          bg={colors.mintGreenLight}
          color={colors.mintGreenDark}
        />
        <StatCard
          icon="fitness"
          label="Weight"
          value={`${latestWeight} kg`}
          bg={colors.skyBlueLight}
          color={colors.skyBlueDark}
        />
        <StatCard
          icon="trophy"
          label="Modules"
          value={`${modulesCount}`}
          bg={colors.sunnyYellowLight}
          color={colors.sunnyYellowDark}
        />
      </Animated.View>

      {/* ── Today's Timeline ──────────────────────── */}
      <Animated.View entering={FadeInDown.delay(400).springify()}>
        <Text style={dashStyles.sectionTitle}>Today's Schedule</Text>
        {todayEvents.map((event, idx) => (
          <Animated.View
            key={event.id}
            entering={FadeInDown.delay(450 + idx * 80).springify()}
          >
            <TimelineItem
              event={event}
              isLast={idx === todayEvents.length - 1}
              onToggle={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleEvent(event.id);
              }}
            />
          </Animated.View>
        ))}
      </Animated.View>

      {/* ── Rewind Teaser ─────────────────────────── */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <Card bg={colors.softCoralLight} shadow="md" radius="3xl" style={dashStyles.rewindCard}>
          <View style={dashStyles.rewindInner}>
            <View style={{ flex: 1 }}>
              <Text style={dashStyles.rewindTitle}>📖 Your 2026 Rewind</Text>
              <Text style={dashStyles.rewindBody}>
                Add more memories to build {child.name}'s year book!
              </Text>
            </View>
            <ProgressRing
              progress={0.18}
              size={56}
              strokeWidth={5}
              color={colors.softCoralDark}
              trackColor={colors.softCoral}
            >
              <Text style={dashStyles.rewindPercent}>18%</Text>
            </ProgressRing>
          </View>
        </Card>
      </Animated.View>

      <View style={{ height: spacing['6xl'] }} />
    </ScrollView>
  );
}

// ── Sub-components ─────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  bg,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  bg: string;
  color: string;
}) {
  return (
    <Card bg={bg} shadow="sm" radius="xl" style={dashStyles.statCard}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[dashStyles.statValue, { color }]}>{value}</Text>
      <Text style={dashStyles.statLabel}>{label}</Text>
    </Card>
  );
}

function TimelineItem({
  event,
  isLast,
  onToggle,
}: {
  event: { id: string; time: string; title: string; icon: string; done: boolean };
  isLast: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={dashStyles.timelineItem}>
      {/* Timeline connector line */}
      <View style={dashStyles.timelineLeft}>
        <View
          style={[
            dashStyles.timelineDot,
            event.done && dashStyles.timelineDotDone,
          ]}
        />
        {!isLast && <View style={dashStyles.timelineLine} />}
      </View>

      {/* Event card */}
      <Card
        bg={event.done ? colors.grey50 : colors.white}
        shadow="sm"
        radius="xl"
        style={dashStyles.timelineCard}
        onPress={onToggle}
        haptic
      >
        <View style={dashStyles.timelineCardInner}>
          <Text style={dashStyles.eventIcon}>{event.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                dashStyles.eventTitle,
                event.done && dashStyles.eventTitleDone,
              ]}
            >
              {event.title}
            </Text>
            <Text style={dashStyles.eventTime}>{event.time}</Text>
          </View>
          <Ionicons
            name={event.done ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={event.done ? colors.success : colors.grey400}
          />
        </View>
      </Card>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────
const dashStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },

  // Header
  greeting: {
    ...typography.title,
    color: colors.text,
  },
  childAge: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },

  // Tip of the Day
  tipCard: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
  },
  tipTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.md,
  },
  tipBody: {
    ...typography.body,
    color: colors.grey700,
    marginTop: spacing.sm,
    lineHeight: 22,
  },

  // Bento stats row
  bentoRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  statValue: {
    ...typography.subheading,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Section title
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Timeline
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.grey300,
    marginTop: spacing.lg,
  },
  timelineDotDone: {
    backgroundColor: colors.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.grey200,
    marginTop: spacing.xs,
  },
  timelineCard: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  timelineCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eventIcon: {
    fontSize: 22,
  },
  eventTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  eventTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  eventTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Rewind teaser
  rewindCard: {
    marginTop: spacing.lg,
    padding: spacing.xl,
  },
  rewindInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  rewindTitle: {
    ...typography.subheading,
    color: colors.text,
  },
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
});
