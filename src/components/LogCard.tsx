import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CATEGORY_OPTIONS,
  SYMPTOM_OPTIONS,
  TRIGGER_OPTIONS,
  getOptionLabel,
} from '../constants/options';
import { getSeverityColor } from '../constants/severity';
import { LogEntry, SyncStatus } from '../types/log';
import { formatDateTime } from '../utils/formatDate';

// Her gönderim durumunun yazısı ve renkleri
const STATUS_STYLES: Record<SyncStatus, { label: string; color: string; background: string }> = {
  pending: { label: '⏳ Gönderilmeyi bekliyor', color: '#8D6E00', background: '#FFF8E1' },
  synced: { label: '✅ Gönderildi', color: '#1B5E20', background: '#E8F5E9' },
  failed: { label: '⚠️ Gönderilemedi', color: '#B71C1C', background: '#FFEBEE' },
};

interface LogCardProps {
  log: LogEntry;
  onLongPress?: () => void;
}

export default function LogCard({ log, onLongPress }: LogCardProps) {
  const status = STATUS_STYLES[log.status];

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
      <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
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
    color: '#1A1A1A',
  },
  meta: {
    fontSize: 13,
    color: '#777',
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
    backgroundColor: '#FFF3E0',
    color: '#E65100',
  },
  symptomTag: {
    backgroundColor: '#E3F2FD',
    color: '#0D47A1',
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
