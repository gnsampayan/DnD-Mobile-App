import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

import { ItemEquipmentProvider } from '@/app/context/ItemEquipmentContext';
import { CharacterProvider } from '@/app/context/equipmentActionsContext';
import { StatsDataProvider } from '@/app/context/StatsDataContext';
import { ActionsProvider } from './context/actionsSpellsContext';

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
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ActionsProvider>
          </CharacterProvider>
        </ItemEquipmentProvider>
      </StatsDataProvider>
    </ThemeProvider>
  );
}
