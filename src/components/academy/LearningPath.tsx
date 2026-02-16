/**
 * <LearningPath /> — Duolingo-style vertical path map
 *
 * Renders a winding path of module nodes connected by curved paths.
 * Nodes toggle between locked / available / completed states.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/src/theme/colors';
import { spacing, radii, shadows } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBloomStore } from '@/src/store';

const { width: SCREEN_W } = Dimensions.get('window');
const NODE_SIZE = 68;

// ── Module data ────────────────────────────────────
export interface LearningModule {
  id: string;
  title: string;
  icon: string; // emoji
  color: string;
  requiredAge?: number; // months
}

const MODULES: LearningModule[] = [
  { id: 'sleep-basics', title: 'Sleep Basics', icon: '🌙', color: colors.lavender },
  { id: 'first-foods', title: 'First Foods', icon: '🥣', color: colors.sunnyYellow },
  { id: 'tummy-time', title: 'Tummy Time', icon: '💪', color: colors.mintGreen },
  { id: 'baby-talk', title: 'Baby Talk', icon: '🗣️', color: colors.skyBlue },
  { id: 'teething-101', title: 'Teething 101', icon: '🦷', color: colors.softCoral },
  { id: 'play-learn', title: 'Play & Learn', icon: '🧩', color: colors.lavender },
  { id: 'safety-home', title: 'Home Safety', icon: '🏠', color: colors.sunnyYellow },
  { id: 'toddler-meals', title: 'Toddler Meals', icon: '🍽️', color: colors.mintGreen },
  { id: 'emotions', title: 'Big Emotions', icon: '❤️', color: colors.softCoral },
  { id: 'potty-training', title: 'Potty Training', icon: '🚽', color: colors.skyBlue },
];

// ── Component ──────────────────────────────────────

export function LearningPath() {
  const { completedModules, completeModule } = useBloomStore();

  return (
    <View style={styles.container}>
      {MODULES.map((mod, index) => {
        const isCompleted = completedModules.includes(mod.id);
        // A module is available if the previous one is completed (or it's the first)
        const isAvailable =
          index === 0 || completedModules.includes(MODULES[index - 1].id);
        const isLocked = !isCompleted && !isAvailable;

        // Zig-zag horizontal placement
        const offsetX = index % 2 === 0 ? -40 : 40;

        return (
          <Animated.View
            key={mod.id}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            {/* Connector line (SVG curve) */}
            {index > 0 && (
              <ConnectorLine
                fromLeft={index % 2 !== 0}
                toLeft={index % 2 === 0}
                completed={completedModules.includes(MODULES[index - 1].id)}
              />
            )}

            <View style={[styles.nodeRow, { marginLeft: offsetX }]}>
              <PathNode
                module={mod}
                status={
                  isCompleted ? 'completed' : isAvailable ? 'available' : 'locked'
                }
                onPress={() => {
                  if (isAvailable && !isCompleted) {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    completeModule(mod.id);
                  } else if (isLocked) {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning,
                    );
                  }
                }}
              />
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

// ── PathNode ───────────────────────────────────────

function PathNode({
  module: mod,
  status,
  onPress,
}: {
  module: LearningModule;
  status: 'completed' | 'available' | 'locked';
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor =
    status === 'completed'
      ? mod.color
      : status === 'available'
        ? colors.white
        : colors.grey100;

  const borderColor =
    status === 'completed'
      ? mod.color
      : status === 'available'
        ? mod.color
        : colors.grey300;

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 10, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View style={animStyle}>
        <View
          style={[
            styles.node,
            {
              backgroundColor: bgColor,
              borderColor,
              borderWidth: 3,
              ...shadows.md,
            },
          ]}
        >
          {status === 'locked' ? (
            <Ionicons name="lock-closed" size={24} color={colors.grey400} />
          ) : status === 'completed' ? (
            <View style={styles.nodeInner}>
              <Text style={styles.nodeEmoji}>{mod.icon}</Text>
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark" size={12} color={colors.white} />
              </View>
            </View>
          ) : (
            <Text style={styles.nodeEmoji}>{mod.icon}</Text>
          )}
        </View>
        <Text
          style={[
            styles.nodeLabel,
            status === 'locked' && styles.nodeLabelLocked,
          ]}
          numberOfLines={2}
        >
          {mod.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ── ConnectorLine ──────────────────────────────────

function ConnectorLine({
  fromLeft,
  toLeft,
  completed,
}: {
  fromLeft: boolean;
  toLeft: boolean;
  completed: boolean;
}) {
  const w = 100;
  const h = 30;

  // S-curve path
  const d =
    fromLeft === toLeft
      ? `M ${w / 2} 0 L ${w / 2} ${h}`
      : fromLeft
        ? `M ${w * 0.3} 0 C ${w * 0.3} ${h * 0.5}, ${w * 0.7} ${h * 0.5}, ${w * 0.7} ${h}`
        : `M ${w * 0.7} 0 C ${w * 0.7} ${h * 0.5}, ${w * 0.3} ${h * 0.5}, ${w * 0.3} ${h}`;

  return (
    <View style={styles.connectorContainer}>
      <Svg width={w} height={h}>
        <Path
          d={d}
          stroke={completed ? colors.primaryDark : colors.grey300}
          strokeWidth={3}
          strokeDasharray={completed ? undefined : '6,4'}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  nodeRow: {
    alignItems: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  nodeInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeEmoji: {
    fontSize: 28,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  nodeLabel: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: NODE_SIZE + 30,
    fontWeight: '600',
  },
  nodeLabelLocked: {
    color: colors.grey400,
  },
  connectorContainer: {
    alignItems: 'center',
    height: 30,
  },
});

export default LearningPath;
