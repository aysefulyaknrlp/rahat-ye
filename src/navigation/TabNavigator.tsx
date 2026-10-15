import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import FloatingTabBar from '../components/FloatingTabBar';
import HistoryScreen from '../screens/HistoryScreen';
import LogScreen from '../screens/LogScreen';
import { useLogStore } from '../store/useLogStore';

// Hangi sekmeler var? (Hiçbiri parametre almıyor → undefined)
export type RootTabParamList = {
  Log: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  const unseenCount = useLogStore((state) => state.unseenCount);

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerBackground: () => <View style={styles.header} />, // Yuvarlak köşeli başlık arka planı
        headerShadowVisible: false, // Alttaki düz çizgiyi kaldır
        headerTitleAlign: 'center', // Başlık yazısını ortala
        headerTitleStyle: styles.headerTitle,
        sceneStyle: styles.scene, // Ekranların arka plan rengi
      }}
    >
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          title: 'Öğün Kaydet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Geçmiş',
          tabBarBadge: unseenCount > 0 ? unseenCount : undefined, // Sadece yeni kayıt varsa
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scene: {
    backgroundColor: '#F7F7F7',
  },
});
