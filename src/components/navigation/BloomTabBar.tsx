/**
 * <BloomTabBar /> — Custom bottom tab bar with central FAB
 *
 * 4 tabs: Today | Learn | [FAB] | Care | Rewind
 * The FAB expands into a radial menu to add: Weight, Height, Photo, Log Event.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
  type SharedValue,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/theme/colors';
import { radii, shadows, spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 72;
const FAB_SIZE = 60;

// ── FAB menu items ─────────────────────────────────
interface FabItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const FAB_ITEMS: FabItem[] = [
  { label: 'Weight', icon: 'scale-outline', color: colors.mintGreen },
  { label: 'Height', icon: 'resize-outline', color: colors.skyBlue },
  { label: 'Photo', icon: 'camera-outline', color: colors.softCoral },
  { label: 'Event', icon: 'calendar-outline', color: colors.sunnyYellow },
];

// ── Tab icon map ───────────────────────────────────
const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'today', inactive: 'today-outline' },
  academy: { active: 'school', inactive: 'school-outline' },
  health: { active: 'heart', inactive: 'heart-outline' },
  memories: { active: 'images', inactive: 'images-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Today',
  academy: 'Learn',
  health: 'Care',
  memories: 'Rewind',
};

// ── Component ──────────────────────────────────────
export function BloomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [fabOpen, setFabOpen] = useState(false);
  const fabAnim = useSharedValue(0);

  const toggleFab = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = !fabOpen;
    setFabOpen(next);
    fabAnim.value = withSpring(next ? 1 : 0, {
      damping: 14,
      stiffness: 180,
      mass: 0.8,
    });
  }, [fabOpen, fabAnim]);

  const fabRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(fabAnim.value, [0, 1], [0, 45])}deg` }],
  }));

  // Split routes into left-pair and right-pair around the FAB
  const routes = state.routes;
  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2, 4);

  return (
    <>
      {/* Overlay backdrop when FAB is open */}
      {fabOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.overlay}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={toggleFab} />
          {/* Radial menu items */}
          {FAB_ITEMS.map((item, i) => (
            <FabMenuItem
              key={item.label}
              item={item}
              index={i}
              total={FAB_ITEMS.length}
              anim={fabAnim}
              onPress={() => {
                toggleFab();
                // TODO: navigate to add-flow for item.label
              }}
            />
          ))}
        </Animated.View>
      )}

      {/* Tab bar */}
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, spacing.sm),
          },
        ]}
      >
        {/* Left tabs */}
        {leftRoutes.map((route, index) => (
          <TabButton
            key={route.key}
            route={route}
            index={index}
            isActive={state.index === index}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          />
        ))}

        {/* FAB */}
        <View style={styles.fabContainer}>
          <Pressable onPress={toggleFab}>
            <Animated.View style={[styles.fab, fabRotation]}>
              <Ionicons name="add" size={32} color={colors.white} />
            </Animated.View>
          </Pressable>
        </View>

        {/* Right tabs */}
        {rightRoutes.map((route, index) => {
          const realIndex = index + 2;
          return (
            <TabButton
              key={route.key}
              route={route}
              index={realIndex}
              isActive={state.index === realIndex}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </>
  );
}

// ── TabButton ──────────────────────────────────────
function TabButton({
  route,
  isActive,
  onPress,
}: {
  route: { name: string; key: string };
  index: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const icons = TAB_ICONS[route.name] ?? { active: 'help', inactive: 'help-outline' };
  const label = TAB_LABELS[route.name] ?? route.name;

  return (
    <Pressable
      style={styles.tabButton}
      onPress={() => {
        Haptics.selectionAsync();
        scale.value = withSpring(0.9, { damping: 10, stiffness: 300 });
        setTimeout(() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        }, 100);
        onPress();
      }}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <Ionicons
          name={isActive ? icons.active : icons.inactive}
          size={24}
          color={isActive ? colors.tabBarActive : colors.tabBarInactive}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isActive ? colors.tabBarActive : colors.tabBarInactive },
            isActive && styles.tabLabelActive,
          ]}
        >
          {label}
        </Text>
        {isActive && <View style={styles.activeDot} />}
      </Animated.View>
    </Pressable>
  );
}

// ── FabMenuItem ────────────────────────────────────
function FabMenuItem({
  item,
  index,
  total,
  anim,
  onPress,
}: {
  item: FabItem;
  index: number;
  total: number;
  anim: SharedValue<number>;
  onPress: () => void;
}) {
  const RADIUS = 90;
  // Fan from -60° to +60° (semi-circle above the FAB)
  const angleRange = 120;
  const startAngle = -90 - angleRange / 2;
  const angle = startAngle + (angleRange / (total - 1)) * index;
  const angleRad = (angle * Math.PI) / 180;

  const animStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [
      { translateX: interpolate(anim.value, [0, 1], [0, Math.cos(angleRad) * RADIUS]) },
      { translateY: interpolate(anim.value, [0, 1], [0, Math.sin(angleRad) * RADIUS]) },
      { scale: interpolate(anim.value, [0, 0.5, 1], [0.3, 0.8, 1]) },
    ],
  }));

  return (
    <Animated.View style={[styles.fabMenuItem, animStyle]}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={[styles.fabMenuButton, { backgroundColor: item.color }]}
      >
        <Ionicons name={item.icon} size={22} color={colors.white} />
      </Pressable>
      <Text style={styles.fabMenuLabel}>{item.label}</Text>
    </Animated.View>
  );
}

// ── Styles ─────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    paddingTop: spacing.sm,
    ...shadows.lg,
    // Remove default border
    borderTopWidth: 0,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    ...typography.overline,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.tabBarActive,
    marginTop: 3,
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: FAB_SIZE + spacing.lg,
    marginTop: -FAB_SIZE / 2 - spacing.xs,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: TAB_BAR_HEIGHT + 30,
  },
  fabMenuItem: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + 20,
    alignItems: 'center',
  },
  fabMenuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  fabMenuLabel: {
    ...typography.caption,
    color: colors.white,
    marginTop: 4,
    fontWeight: '600',
  },
});
