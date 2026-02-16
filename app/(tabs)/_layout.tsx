/**
 * Bloom — Tab Layout
 *
 * 4 tabs: Today | Learn | [FAB] | Care | Rewind
 * Uses our custom <BloomTabBar />.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { BloomTabBar } from '@/src/components/navigation/BloomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BloomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="academy" options={{ title: 'Learn' }} />
      <Tabs.Screen name="health" options={{ title: 'Care' }} />
      <Tabs.Screen name="memories" options={{ title: 'Rewind' }} />
    </Tabs>
  );
}
