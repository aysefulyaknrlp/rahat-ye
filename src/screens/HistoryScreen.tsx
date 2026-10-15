import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import LogCard from '../components/LogCard';
import { useLogStore } from '../store/useLogStore';
import { LogEntry } from '../types/log';

export default function HistoryScreen() {
  const logs = useLogStore((state) => state.logs);
  const removeLog = useLogStore((state) => state.removeLog);
  const markAllSeen = useLogStore((state) => state.markAllSeen);

  // Bu ekran her açıldığında (odaklandığında) rozeti sıfırla
  useFocusEffect(
    useCallback(() => {
      markAllSeen();
    }, [markAllSeen]),
  );

  // Tarihe göre sırala: en yeni en üstte
  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [logs],
  );

  function confirmDelete(log: LogEntry) {
    Alert.alert('Kaydı sil', `"${log.foodName}" silinsin mi?`, [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => removeLog(log.id) },
    ]);
  }

  return (
    <FlatList
      data={sortedLogs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <LogCard log={item} onLongPress={() => confirmDelete(item)} />
      )}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        sortedLogs.length > 0 ? (
          <Text style={styles.header}>
            {sortedLogs.length} kayıt · Silmek için karta basılı tut
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>Henüz kayıt yok</Text>
          <Text style={styles.emptyText}>
            "Öğün Kaydet" sekmesinden ilk öğününü ekle.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 120, // Alttaki yüzen menünün arkasında kalmasın
    backgroundColor: '#F7F7F7',
  },
  separator: {
    height: 12,
  },
  header: {
    fontSize: 13,
    color: '#777',
    marginBottom: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});
