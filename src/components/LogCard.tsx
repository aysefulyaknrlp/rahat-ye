import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CATEGORY_OPTIONS,
  SYMPTOM_OPTIONS,
  TRIGGER_OPTIONS,
  getOptionLabel,
} from '../constants/options';
import { getSeverityColor } from '../constants/severity';
import { LogEntry, SyncStatus } from '../types/log';
import { formatDateTime } from '../utils/formatDate';
import { ThemeColors } from '../theme/colors';
import { useThemeColors, useThemedStyles } from '../theme/useTheme';

// Her gönderim durumunun yazısı ve renkleri (tema renklerinden)
function getStatusStyle(status: SyncStatus, colors: ThemeColors) {
  switch (status) {
    case 'pending':
      return {
        label: '⏳ Gönderilmeyi bekliyor',
        color: colors.warningText,
        background: colors.warningBackground,
      };
    case 'synced':
      return { label: '✅ Gönderildi', color: colors.successText, background: colors.successBackground };
    case 'failed':
      return { label: '⚠️ Gönderilemedi', color: colors.dangerText, background: colors.dangerBackground };
  }
}

interface LogCardProps {
  log: LogEntry;
  isSyncing?: boolean; // Şu an sunucuya gönderiliyor mu?
  onRetry?: () => void; // "Tekrar Dene"ye basılınca
  onLongPress?: () => void;
}

export default function LogCard({ log, isSyncing = false, onRetry, onLongPress }: LogCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const status = getStatusStyle(log.status, colors);

  return (
    <Pressable
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Üst kısım: yemek adı, tarih, kategori ve şiddet */}
      <View style={styles.header}>
        <View style={styles.titleBox}>
          <Text style={styles.foodName} numberOfLines={1}>
            {log.foodName}
          </Text>
          <Text style={styles.meta}>{formatDateTime(log.createdAt)}</Text>
          <Text style={styles.meta}>{getOptionLabel(CATEGORY_OPTIONS, log.category)}</Text>
        </View>

        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(log.severity) }]}>
          <Text style={styles.severityNumber}>{log.severity}</Text>
          <Text style={styles.severityCaption}>/5</Text>
        </View>
      </View>

      {/* Tetikleyiciler (varsa) */}
      {log.triggers.length > 0 && (
        <View style={styles.tagRow}>
          {log.triggers.map((trigger) => (
            <Text key={trigger} style={[styles.tag, styles.triggerTag]}>
              {getOptionLabel(TRIGGER_OPTIONS, trigger)}
            </Text>
          ))}
        </View>
      )}

      {/* Semptomlar (varsa) */}
      {log.symptoms.length > 0 && (
        <View style={styles.tagRow}>
          {log.symptoms.map((symptom) => (
            <Text key={symptom} style={[styles.tag, styles.symptomTag]}>
              {getOptionLabel(SYMPTOM_OPTIONS, symptom)}
            </Text>
          ))}
        </View>
      )}

      {/* Gönderim durumu */}
      <View style={styles.statusRow}>
        {isSyncing ? (
          // Gönderiliyorsa: dönen animasyon
          <View style={styles.syncing}>
            <ActivityIndicator size="small" color={colors.infoText} />
            <Text style={styles.syncingText}>Gönderiliyor...</Text>
          </View>
        ) : (
          // Gönderilmiyorsa: durum etiketi
          <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        )}

        {/* Sadece başarısızsa ve şu an gönderilmiyorsa "Tekrar Dene" */}
        {log.status === 'failed' && !isSyncing && onRetry && (
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel={`${log.foodName} kaydını tekrar gönder`}
            style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
          >
            <Text style={styles.retryText}>↻ Tekrar Dene</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

// Stiller tema renklerine göre üretiliyor
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    pressed: {
      opacity: 0.85,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    titleBox: {
      flex: 1,
      gap: 2,
    },
    foodName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    meta: {
      fontSize: 13,
      color: colors.textMuted,
    },
    severityBadge: {
      flexDirection: 'row',
      alignItems: 'baseline',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    severityNumber: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '800',
    },
    severityCaption: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    tag: {
      fontSize: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      overflow: 'hidden',
    },
    triggerTag: {
      backgroundColor: colors.triggerBackground,
      color: colors.triggerText,
    },
    symptomTag: {
      backgroundColor: colors.infoBackground,
      color: colors.infoText,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    syncing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    syncingText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.infoText,
    },
    retryButton: {
      backgroundColor: colors.danger,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    retryText: {
      color: colors.onPrimary,
      fontSize: 12,
      fontWeight: '700',
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
  });
