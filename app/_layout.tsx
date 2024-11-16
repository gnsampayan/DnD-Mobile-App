import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

import { ItemEquipmentProvider } from '../context/ItemEquipmentContext';
import { CharacterProvider } from '../context/equipmentActionsContext';
import { StatsDataProvider } from '../context/StatsDataContext';
import { ActionsProvider } from '../context/actionsSpellsContext';
import { CantripSlotsProvider } from '../context/cantripSlotsContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatsDataProvider>
        <ItemEquipmentProvider>
          <CharacterProvider>
            <ActionsProvider>
              <CantripSlotsProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </CantripSlotsProvider>
            </ActionsProvider>
          </CharacterProvider>
        </ItemEquipmentProvider>
      </StatsDataProvider>
    </ThemeProvider>
  );
}
