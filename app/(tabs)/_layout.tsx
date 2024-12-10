import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import StatsDataContext from '../../context/StatsDataContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Use context for statsData
  const { isSpellCaster, statsData } = useContext(StatsDataContext) as {
    isSpellCaster: boolean;
    statsData: { class?: string; level?: number };
  };

  // Check if user is a paladin or ranger below level 2
  const isLowLevelSpellcaster = (
    (statsData.class?.toLowerCase() === 'paladin' || statsData.class?.toLowerCase() === 'ranger')
    && (statsData.level || 0) < 2
  );
  const showSpellbook = isSpellCaster && !isLowLevelSpellcaster;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Actions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'run-fast' : 'run'} color={color} family="MaterialCommunityIcons" />
          ),
        }}
      />
      {/* Conditionally hide the Spellbook tab button */}
      <Tabs.Screen
        name="spellbook"
        options={{
          title: 'Spells',
          href: showSpellbook ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'star-shooting' : 'star-shooting-outline'} color={color} family="MaterialCommunityIcons" />
          ),
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bag-personal' : 'bag-personal-outline'} color={color} family="MaterialCommunityIcons" />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Character',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'body' : 'body-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
