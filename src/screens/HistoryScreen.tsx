import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import LogCard from '../components/LogCard';
import { useLogStore } from '../store/useLogStore';
import { LogEntry } from '../types/log';

export default function HistoryScreen() {
  const logs = useLogStore((state) => state.logs);
  const removeLog = useLogStore((state) => state.removeLog);
  const markAllSeen = useLogStore((state) => state.markAllSeen);
  const syncingIds = useLogStore((state) => state.syncingIds);
  const syncLog = useLogStore((state) => state.syncLog);
  const retryFailedLogs = useLogStore((state) => state.retryFailedLogs);

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

  // Gönderilemeyen kayıt sayısı
  const failedCount = logs.filter(
    (log) => log.status === 'failed' && !syncingIds.includes(log.id),
  ).length;

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
      extraData={syncingIds} // syncingIds değişince listeyi yeniden çiz
      renderItem={({ item }) => (
        <LogCard
          log={item}
          isSyncing={syncingIds.includes(item.id)}
          onRetry={() => void syncLog(item.id)}
          onLongPress={() => confirmDelete(item)}
        />
      )}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        sortedLogs.length > 0 ? (
          <View style={styles.headerBox}>
            <Text style={styles.header}>
              {sortedLogs.length} kayıt · Silmek için karta basılı tut
            </Text>

            {/* Başarısız kayıt varsa toplu "Tekrar Dene" uyarısı */}
            {failedCount > 0 && (
              <View style={styles.failedBox}>
                <Text style={styles.failedText}>
                  ⚠️ {failedCount} kayıt sunucuya gönderilemedi
                </Text>
                <Pressable
                  onPress={retryFailedLogs}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.failedButton, pressed && styles.pressed]}
                >
                  <Text style={styles.failedButtonText}>Tümünü Tekrar Dene</Text>
                </Pressable>
              </View>
            )}
          </View>
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
  headerBox: {
    gap: 10,
    marginBottom: 12,
  },
  header: {
    fontSize: 13,
    color: '#777',
  },
  failedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
  },
  failedText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#B71C1C',
  },
  failedButton: {
    backgroundColor: '#C62828',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  failedButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
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
