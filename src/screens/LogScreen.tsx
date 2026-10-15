import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Chip from '../components/Chip';
import { CATEGORY_OPTIONS, SYMPTOM_OPTIONS, TRIGGER_OPTIONS } from '../constants/options';
import { MealCategory, Symptom, TriggerTag } from '../types/log';

// Listede varsa çıkarır, yoksa ekler
function toggleItem<T>(list: T[], item: T): T[] {
  if (list.includes(item)) {
    return list.filter((x) => x !== item);
  }
  return [...list, item];
}

export default function LogScreen() {
  const [category, setCategory] = useState<MealCategory | null>(null);
  const [triggers, setTriggers] = useState<TriggerTag[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Öğün Kaydet 🌿</Text>

      <Text style={styles.sectionTitle}>Kategori</Text>
      <View style={styles.chipRow}>
        {CATEGORY_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={category === option.value}
            onPress={() => setCategory(category === option.value ? null : option.value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tetikleyiciler</Text>
      <View style={styles.chipRow}>
        {TRIGGER_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={triggers.includes(option.value)}
            onPress={() => setTriggers(toggleItem(triggers, option.value))}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Semptomlar</Text>
      <View style={styles.chipRow}>
        {SYMPTOM_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={symptoms.includes(option.value)}
            onPress={() => setSymptoms(toggleItem(symptoms, option.value))}
          />
        ))}
      </View>

      {/* Geçici: state'in nasıl değiştiğini görmek için */}
      <Text style={styles.debug}>
        {JSON.stringify({ category, triggers, symptoms }, null, 2)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 72,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  debug: {
    marginTop: 32,
    padding: 12,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    fontFamily: 'Courier',
    fontSize: 12,
  },
});