import { Tabs } from 'expo-router';
import React from 'react';
import { StatsDataProvider } from '@/app/context/StatsDataContext';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <StatsDataProvider>
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
              <TabBarIcon name={focused ? 'flash' : 'flash-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bag"
          options={{
            title: 'Bag',
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
              <TabBarIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="character"
          options={{
            title: 'Character',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'shirt' : 'shirt-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </StatsDataProvider>
  );
}
