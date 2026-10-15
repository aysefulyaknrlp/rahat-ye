import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors, darkColors, lightColors } from './colors';

// Telefonun temasına (açık/koyu) göre doğru renk setini verir
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  return scheme === 'dark' ? darkColors : lightColors;
}

// Renklere göre stil üretir. Tema değişince stiller otomatik yeniden oluşturulur.
// Kullanım: const styles = useThemedStyles(createStyles);
export function useThemedStyles<T>(createStyles: (colors: ThemeColors) => T): T {
  const colors = useThemeColors();
  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
