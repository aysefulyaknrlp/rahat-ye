import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { MOCK_API_CONFIG } from '../services/api';
import { ThemeColors } from '../theme/colors';
import { useThemedStyles } from '../theme/useTheme';

// Sadece geliştirme modunda görünen test aracı:
// Açılınca sahte API her isteği başarısız yapar (Tekrar Dene akışını göstermek için)
export default function DevNetworkToggle() {
  const styles = useThemedStyles(createStyles);
  const [forceFailure, setForceFailure] = useState(MOCK_API_CONFIG.failureRate === 1);

  function handleChange(value: boolean) {
    setForceFailure(value);
    MOCK_API_CONFIG.failureRate = value ? 1 : 0.1;
  }

  return (
    <View style={styles.row}>
      <View style={styles.textBox}>
        <Text style={styles.title}>🧪 Ağ hatası simülasyonu</Text>
        <Text style={styles.subtitle}>
          {forceFailure ? 'Tüm istekler başarısız olacak' : 'Normal: %10 hata olasılığı'}
        </Text>
      </View>
      <Switch value={forceFailure} onValueChange={handleChange} />
    </View>
  );
}

// Stiller tema renklerine göre üretiliyor
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.borderStrong,
    },
    textBox: {
      flex: 1,
    },
    title: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSubtle,
      marginTop: 2,
    },
  });
