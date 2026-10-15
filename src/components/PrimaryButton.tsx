import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

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
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#BDBDBD',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
