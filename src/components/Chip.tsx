import { Pressable, StyleSheet, Text } from 'react-native';
import { ThemeColors } from '../theme/colors';
import { useThemedStyles } from '../theme/useTheme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function Chip({ label, selected, onPress }: ChipProps) {
  const styles = useThemedStyles(createStyles);

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

// Stiller tema renklerine göre üretiliyor
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surface,
    },
    chipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipPressed: {
      opacity: 0.6,
    },
    label: {
      fontSize: 14,
      color: colors.text,
    },
    labelSelected: {
      color: colors.onPrimary,
      fontWeight: '600',
    },
  });
