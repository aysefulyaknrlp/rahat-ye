import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import TabNavigator from './src/navigation/TabNavigator';
import { useLogStore } from './src/store/useLogStore';

export default function App() {
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
    <NavigationContainer>
      <TabNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
