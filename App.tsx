import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';
import { useLogStore } from './src/store/useLogStore';
import { useThemeColors } from './src/theme/useTheme';

export default function App() {
  const scheme = useColorScheme();
  const colors = useThemeColors();

  // React Navigation'ın kendi temasını bizim renklerimizle uyumlu hale getir
  const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  // Uygulama açılınca: önceki oturumdan kalan "pending" kayıtları sunucuya gönder
  useEffect(() => {
    const syncPending = () => useLogStore.getState().syncPendingLogs();

    // Kayıtlar telefondan okunduysa hemen çalıştır, okunmadıysa okunmasını bekle
    if (useLogStore.persist.hasHydrated()) {
      syncPending();
    }
    return useLogStore.persist.onFinishHydration(syncPending);
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <TabNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
