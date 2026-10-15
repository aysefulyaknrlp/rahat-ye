import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { MOCK_API_CONFIG } from '../services/api';

// Sadece geliştirme modunda görünen test aracı:
// Açılınca sahte API her isteği başarısız yapar (Tekrar Dene akışını göstermek için)
export default function DevNetworkToggle() {
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BDBDBD',
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
