import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import StatsDataContext from '../context/StatsDataContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Use context for statsData
  const { isSpellCaster } = useContext(StatsDataContext) as {
    isSpellCaster: boolean;
  };


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Actions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'dice' : 'dice-outline'} color={color} />
          ),
        }}
      />
      {/* Conditionally hide the Spellbook tab button */}
      <Tabs.Screen
        name="spellbook"
        options={{
          title: 'Spellbook',
          href: isSpellCaster ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bag' : 'bag-outline'} color={color} />
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
