/**
 * <Card /> — Bloom's primary surface component
 *
 * Features soft shadow, generous border-radius and an optional
 * "bouncy press" animation powered by Reanimated.
 */

import { colors } from '@/src/theme/colors';
import { radii, shadows, spacing } from '@/src/theme/spacing';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 200,
  mass: 0.6,
};

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Background color override */
  bg?: string;
  /** Enable bouncy press feedback (default: true when onPress provided) */
  bouncy?: boolean;
  /** Optional press handler */
  onPress?: () => void;
  /** Shadow depth */
  shadow?: 'sm' | 'md' | 'lg';
  /** Border radius preset */
  radius?: keyof typeof radii;
  /** Haptic feedback on press (default true) */
  haptic?: boolean;
}

export function Card({
  children,
  style,
  bg = colors.card,
  bouncy,
  onPress,
  shadow = 'md',
  radius = '2xl',
  haptic = true,
}: CardProps) {
  const scale = useSharedValue(1);
  const isBouncy = bouncy ?? !!onPress;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!isBouncy) return;
    scale.value = withSpring(0.96, SPRING_CONFIG);
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isBouncy, haptic, scale]);

  const handlePressOut = useCallback(() => {
    if (!isBouncy) return;
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [isBouncy, scale]);

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radii[radius],
    ...shadows[shadow],
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, cardStyle, animatedStyle, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  // Non-interactive variant — skip the Animated wrapper for performance
  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    overflow: 'hidden',
  },
});

export default Card;
