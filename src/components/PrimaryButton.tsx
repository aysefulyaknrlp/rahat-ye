import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { ThemeColors } from '../theme/colors';
import { useThemeColors, useThemedStyles } from '../theme/useTheme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean; // ? = zorunlu değil
  loading?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        disabled && !loading && styles.disabled, // Yüklenirken yeşil kalsın, sadece pasifken gri
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

// Stiller tema renklerine göre üretiliyor
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
    },
    disabled: {
      backgroundColor: colors.disabled,
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    text: {
      color: colors.onPrimary,
      fontSize: 17,
      fontWeight: '700',
    },
  });
