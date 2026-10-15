import { Pressable, StyleSheet, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  chipPressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  labelSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});