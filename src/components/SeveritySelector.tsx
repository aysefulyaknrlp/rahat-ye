import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SEVERITY_LEVELS } from '../constants/severity';
import { Severity } from '../types/log';

interface SeveritySelectorProps {
  value: Severity | null;
  onChange: (value: Severity) => void;
}

export default function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  return (
    <View>
      <View style={styles.row}>
        {SEVERITY_LEVELS.map((level) => {
          const selected = value === level.value;
          return (
            <Pressable
              key={level.value}
              onPress={() => onChange(level.value)}
              accessibilityRole="button"
              accessibilityLabel={`Şiddet ${level.value}`}
              accessibilityState={{ selected }}
              style={({ pressed }) => [
                styles.circle,
                { borderColor: level.color },
                selected && { backgroundColor: level.color },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.number, { color: selected ? '#fff' : level.color }]}>
                {level.value}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.hintRow}>
        <Text style={styles.hint}>Çok hafif</Text>
        <Text style={styles.hint}>Çok şiddetli</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pressed: {
    transform: [{ scale: 0.9 }],
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    color: '#777',
  },
});
