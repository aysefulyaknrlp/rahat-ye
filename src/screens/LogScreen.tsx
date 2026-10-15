import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import SeveritySelector from '../components/SeveritySelector';
import { CATEGORY_OPTIONS, SYMPTOM_OPTIONS, TRIGGER_OPTIONS } from '../constants/options';
import type { RootTabParamList } from '../navigation/TabNavigator';
import { useLogStore } from '../store/useLogStore';
import { MealCategory, Severity, Symptom, TriggerTag } from '../types/log';
import { toggleItem } from '../utils/toggleItem';
import { FOOD_NAME_MAX_LENGTH, validateLogForm } from '../utils/validation';

export default function LogScreen() {
  // Store'dan sadece ihtiyacımız olanları alıyoruz
  const addLog = useLogStore((state) => state.addLog);

  // Ekranlar arası geçiş için
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  // Formun hafızası (state)
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<MealCategory | null>(null);
  const [triggers, setTriggers] = useState<TriggerTag[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState<Severity | null>(null);

  // Kullanıcı yemek adı kutusuna dokunup çıktı mı?
  const [foodNameTouched, setFoodNameTouched] = useState(false);

  // Her çizimde formu yeniden kontrol et
  const errors = validateLogForm({ foodName, category, severity });
  const isValid = Object.keys(errors).length === 0;
  const showFoodNameError = foodNameTouched && errors.foodName !== undefined;

  function resetForm() {
    setFoodName('');
    setCategory(null);
    setTriggers([]);
    setSymptoms([]);
    setSeverity(null);
    setFoodNameTouched(false);
  }

  function handleSave() {
    // category ve severity'nin null olmadığını TypeScript'e de kanıtlıyoruz
    if (!isValid || category === null || severity === null) return;

    // Kaydı store'a ekle → store da otomatik olarak telefona (AsyncStorage) yazar
    addLog({
      foodName: foodName.trim(),
      category,
      triggers,
      symptoms,
      severity,
    });

    Alert.alert('Kaydedildi ✅', `"${foodName.trim()}" telefonuna kaydedildi.`, [
      { text: 'Tamam' },
      { text: 'Geçmişe Git', onPress: () => navigation.navigate('History') },
    ]);
    resetForm();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Ne yediğini ve sonrasında nasıl hissettiğini kaydet.
        </Text>

        {/* Yemek adı */}
        <Text style={styles.sectionTitle}>Yemek Adı *</Text>
        <TextInput
          style={[styles.input, showFoodNameError && styles.inputError]}
          placeholder="Örn. Mercimek çorbası"
          placeholderTextColor="#999"
          value={foodName}
          onChangeText={setFoodName}
          onBlur={() => setFoodNameTouched(true)}
          maxLength={FOOD_NAME_MAX_LENGTH}
          returnKeyType="done"
        />
        {showFoodNameError && <Text style={styles.errorText}>{errors.foodName}</Text>}

        {/* Kategori: tek seçim */}
        <Text style={styles.sectionTitle}>Kategori *</Text>
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

        {/* Tetikleyiciler: çoklu seçim */}
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

        {/* Semptomlar: çoklu seçim */}
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

        {/* Şiddet derecesi: 1-5 */}
        <Text style={styles.sectionTitle}>Şiddet Derecesi *</Text>
        <SeveritySelector value={severity} onChange={setSeverity} />

        {/* Kaydet */}
        <View style={styles.footer}>
          <PrimaryButton title="Kaydet" onPress={handleSave} disabled={!isValid} />

          {!isValid && (
            <View style={styles.missingBox}>
              <Text style={styles.missingTitle}>Kaydetmek için:</Text>
              {Object.values(errors).map((message) => (
                <Text key={message} style={styles.missingItem}>
                  • {message}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingBottom: 120, // Alttaki yüzen menünün arkasında kalmasın
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#C62828',
  },
  errorText: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    marginTop: 32,
  },
  missingBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
  },
  missingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8D6E00',
    marginBottom: 4,
  },
  missingItem: {
    fontSize: 13,
    color: '#8D6E00',
  },
});
