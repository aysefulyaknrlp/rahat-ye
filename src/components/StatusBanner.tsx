import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '../theme/colors';
import { useThemeColors } from '../theme/useTheme';

export type BannerType = 'info' | 'success' | 'error';

// Her tipin renkleri ve ikonu (tema renklerinden)
function getBannerStyle(type: BannerType, colors: ThemeColors) {
  switch (type) {
    case 'info':
      return { color: colors.infoText, background: colors.infoBackground, icon: '' };
    case 'success':
      return { color: colors.successText, background: colors.successBackground, icon: '✅' };
    case 'error':
      return { color: colors.dangerText, background: colors.dangerBackground, icon: '⚠️' };
  }
}

interface StatusBannerProps {
  type: BannerType;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatusBanner({ type, message, actionLabel, onAction }: StatusBannerProps) {
  const colors = useThemeColors();
  const style = getBannerStyle(type, colors);

  return (
    <View
      style={[styles.banner, { backgroundColor: style.background }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {type === 'info' ? (
        <ActivityIndicator color={style.color} />
      ) : (
        <Text style={styles.icon}>{style.icon}</Text>
      )}

      <Text style={[styles.message, { color: style.color }]}>{message}</Text>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.action,
            { borderColor: style.color },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.actionText, { color: style.color }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  icon: {
    fontSize: 18,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  action: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
