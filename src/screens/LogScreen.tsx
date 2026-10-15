import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Chip from '../components/Chip';
import DevNetworkToggle from '../components/DevNetworkToggle';
import PrimaryButton from '../components/PrimaryButton';
import SeveritySelector from '../components/SeveritySelector';
import StatusBanner, { BannerType } from '../components/StatusBanner';
import { CATEGORY_OPTIONS, SYMPTOM_OPTIONS, TRIGGER_OPTIONS } from '../constants/options';
import type { RootTabParamList } from '../navigation/TabNavigator';
import { useLogStore } from '../store/useLogStore';
import { MealCategory, Severity, Symptom, TriggerTag } from '../types/log';
import { toggleItem } from '../utils/toggleItem';
import { FOOD_NAME_MAX_LENGTH, validateLogForm } from '../utils/validation';

// Kaydet'ten sonra gösterilecek mesajın bilgisi
interface BannerState {
  type: BannerType;
  message: string;
  logId?: string; // Hata durumunda "Tekrar Dene" için hangi kayıt?
  foodName?: string; // ve o kaydın adı
}

export default function LogScreen() {
  // Store'dan sadece ihtiyacımız olanları alıyoruz
  const addLog = useLogStore((state) => state.addLog);
  const syncLog = useLogStore((state) => state.syncLog);

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

  // Sunucuya gönderim durumu
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<BannerState | null>(null);

  // Başarı mesajını 4 saniye sonra otomatik gizle
  useEffect(() => {
    if (banner?.type !== 'success') return;
    const timer = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(timer); // Ekran kapanırsa zamanlayıcıyı temizle
  }, [banner]);

  // Her çizimde formu yeniden kontrol et
  const errors = validateLogForm({ foodName, category, severity });
  const isValid = Object.keys(errors).length === 0;
  const showFoodNameError = foodNameTouched && errors.foodName !== undefined;

  // Form tamamen boş mu? (Boşken "eksikler" kutusunu göstermeyelim)
  const isPristine =
    foodName === '' &&
    category === null &&
    triggers.length === 0 &&
    symptoms.length === 0 &&
    severity === null;

  function resetForm() {
    setFoodName('');
    setCategory(null);
    setTriggers([]);
    setSymptoms([]);
    setSeverity(null);
    setFoodNameTouched(false);
  }

  // Bir kaydı sunucuya gönderir ve sonucu mesaj olarak gösterir
  async function sendToServer(logId: string, name: string) {
    setIsSubmitting(true);
    setBanner({ type: 'info', message: 'Sunucuya gönderiliyor...' });

    const success = await syncLog(logId);

    setIsSubmitting(false);
    if (success) {
      setBanner({ type: 'success', message: `"${name}" kaydedildi ve sunucuya gönderildi.` });
    } else {
      setBanner({
        type: 'error',
        message: `"${name}" telefona kaydedildi ama sunucuya gönderilemedi.`,
        logId,
        foodName: name,
      });
    }
  }

  async function handleSave() {
    // category ve severity'nin null olmadığını TypeScript'e de kanıtlıyoruz
    if (!isValid || category === null || severity === null || isSubmitting) return;

    const name = foodName.trim();

    // 1) ÖNCE telefona kaydet (offline-first: internet olmasa da veri kaybolmaz)
    const entry = addLog({ foodName: name, category, triggers, symptoms, severity });

    // Veri artık güvende, formu temizleyebiliriz
    resetForm();

    // 2) SONRA sunucuya göndermeyi dene
    await sendToServer(entry.id, name);
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
          {banner && (
            <View style={styles.banner}>
              <StatusBanner
                type={banner.type}
                message={banner.message}
                actionLabel={
                  banner.type === 'error' ? 'Tekrar Dene' : banner.type === 'success' ? 'Geçmiş' : undefined
                }
                onAction={() => {
                  if (banner.type === 'error' && banner.logId) {
                    void sendToServer(banner.logId, banner.foodName ?? '');
                  } else if (banner.type === 'success') {
                    navigation.navigate('History');
                  }
                }}
              />
            </View>
          )}

          <PrimaryButton
            title="Kaydet"
            onPress={handleSave}
            disabled={!isValid}
            loading={isSubmitting}
          />

          {!isValid && !isPristine && (
            <View style={styles.missingBox}>
              <Text style={styles.missingTitle}>Kaydetmek için:</Text>
              {Object.values(errors).map((message) => (
                <Text key={message} style={styles.missingItem}>
                  • {message}
                </Text>
              ))}
            </View>
          )}

          {/* Sadece geliştirme modunda görünür, uygulama yayınlanınca kaybolur */}
          {__DEV__ && (
            <View style={styles.devTools}>
              <DevNetworkToggle />
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
  banner: {
    marginBottom: 12,
  },
  devTools: {
    marginTop: 24,
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
