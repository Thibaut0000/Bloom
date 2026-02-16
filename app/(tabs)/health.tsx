/**
 * Health — "Care" Tab
 *
 * Growth charts (weight/height) + vaccine log.
 * Uses simple View-based charts (no Victory/Skia dependency for MVP).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { colors } from '@/src/theme/colors';
import { spacing, radii, shadows } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBloomStore } from '@/src/store';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = SCREEN_W - spacing.xl * 2 - spacing.lg * 2;
const CHART_H = 180;

type ChartMode = 'weight' | 'height';

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const { child, growthEntries, vaccines, markVaccineDone } = useBloomStore();
  const [chartMode, setChartMode] = useState<ChartMode>('weight');

  // Prepare chart data
  const data = growthEntries.map((e) => ({
    label: new Date(e.date).toLocaleDateString('en', { month: 'short', year: '2-digit' }),
    value: chartMode === 'weight' ? (e.weightKg ?? 0) : (e.heightCm ?? 0),
  }));

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  const range = maxVal - minVal || 1;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={styles.title}>{child.name}'s Health 💚</Text>
        <Text style={styles.subtitle}>Growth tracking & medical log</Text>
      </Animated.View>

      {/* Toggle Weight / Height */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.toggleRow}>
        <TogglePill
          label="Weight (kg)"
          active={chartMode === 'weight'}
          onPress={() => { setChartMode('weight'); Haptics.selectionAsync(); }}
        />
        <TogglePill
          label="Height (cm)"
          active={chartMode === 'height'}
          onPress={() => { setChartMode('height'); Haptics.selectionAsync(); }}
        />
      </Animated.View>

      {/* Growth Chart */}
      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <Card bg={colors.white} shadow="md" radius="2xl" style={styles.chartCard}>
          <View style={styles.chart}>
            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              <Text style={styles.axisLabel}>{maxVal.toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{((maxVal + minVal) / 2).toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{minVal.toFixed(1)}</Text>
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
              {data.map((d, i) => {
                const barH = ((d.value - minVal) / range) * (CHART_H - 40);
                return (
                  <Animated.View
                    key={i}
                    entering={FadeInDown.delay(350 + i * 60).springify()}
                    style={styles.barColumn}
                  >
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(barH, 4),
                          backgroundColor:
                            chartMode === 'weight'
                              ? colors.mintGreen
                              : colors.skyBlue,
                          borderRadius: radii.sm,
                        },
                      ]}
                    />
                    <Text style={styles.barLabel} numberOfLines={1}>
                      {d.label}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>
          </View>

          {/* Latest reading */}
          <View style={styles.latestRow}>
            <Ionicons
              name={chartMode === 'weight' ? 'scale-outline' : 'resize-outline'}
              size={18}
              color={colors.textSecondary}
            />
            <Text style={styles.latestText}>
              Latest: {data[data.length - 1]?.value.toFixed(1)}{' '}
              {chartMode === 'weight' ? 'kg' : 'cm'}
            </Text>
          </View>
        </Card>
      </Animated.View>

      {/* Vaccine / Medical Log */}
      <Animated.View entering={FadeInDown.delay(500).springify()}>
        <Text style={styles.sectionTitle}>Vaccine Log 💉</Text>
        {vaccines.map((vax, idx) => {
          const isDone = !!vax.doneDate;
          return (
            <Animated.View
              key={vax.id}
              entering={FadeInRight.delay(550 + idx * 80).springify()}
            >
              <Card
                bg={isDone ? colors.grey50 : colors.white}
                shadow="sm"
                radius="xl"
                style={styles.vaxCard}
                onPress={() => {
                  if (!isDone) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    markVaccineDone(vax.id, new Date().toISOString().slice(0, 10));
                  }
                }}
              >
                <View style={styles.vaxRow}>
                  <View
                    style={[
                      styles.vaxIndicator,
                      { backgroundColor: isDone ? colors.success : colors.warning },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.vaxName, isDone && styles.vaxNameDone]}>
                      {vax.name}
                    </Text>
                    <Text style={styles.vaxDate}>
                      {isDone
                        ? `Done on ${vax.doneDate}`
                        : `Due: ${vax.dueDate}`}
                    </Text>
                  </View>
                  <Ionicons
                    name={isDone ? 'checkmark-circle' : 'time-outline'}
                    size={24}
                    color={isDone ? colors.success : colors.warning}
                  />
                </View>
              </Card>
            </Animated.View>
          );
        })}
      </Animated.View>

      <View style={{ height: spacing['6xl'] }} />
    </ScrollView>
  );
}

// ── Sub-components ─────────────────────────────────

function TogglePill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
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
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.grey100,
  },
  pillActive: {
    backgroundColor: colors.primaryDark,
  },
  pillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.white,
  },

  // Chart
  chartCard: { padding: spacing.lg },
  chart: {
    flexDirection: 'row',
    height: CHART_H,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  axisLabel: {
    ...typography.overline,
    color: colors.textTertiary,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 16,
    minHeight: 4,
  },
  barLabel: {
    ...typography.overline,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    fontSize: 8,
  },
  latestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  latestText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Vaccine
  vaxCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  vaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  vaxIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vaxName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  vaxNameDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  vaxDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
