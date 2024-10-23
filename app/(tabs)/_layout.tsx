import { Tabs } from 'expo-router';
import React from 'react';
import { StatsDataProvider } from '@/app/context/StatsDataContext';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ItemEquipmentProvider } from '../context/ItemEquipmentContext';
import { CharacterProvider } from '../context/equipmentActionsContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <StatsDataProvider>
      <ItemEquipmentProvider>
        <CharacterProvider>

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
        </CharacterProvider>
      </ItemEquipmentProvider>
    </StatsDataProvider>
  );
}
