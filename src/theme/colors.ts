// Uygulamanın tüm renkleri burada. Açık ve koyu tema aynı isimleri kullanır,
// sadece değerleri farklıdır. Component'ler renkleri isimleriyle kullanır.
export interface ThemeColors {
  background: string; // Ekran arka planı
  surface: string; // Kart, kutu, başlık, tab bar arka planı
  border: string; // İnce çizgiler
  borderStrong: string; // Input ve chip kenarlıkları
  text: string; // Ana yazı
  textMuted: string; // İkincil (gri) yazı
  textSubtle: string; // Çok soluk yazı (placeholder)
  primary: string; // Ana renk (yeşil)
  onPrimary: string; // Ana rengin üstündeki yazı
  disabled: string; // Pasif buton
  danger: string; // Hata butonu, kırmızı
  dangerBackground: string;
  dangerText: string;
  successBackground: string;
  successText: string;
  warningBackground: string;
  warningText: string;
  infoBackground: string;
  infoText: string;
  triggerBackground: string;
  triggerText: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  background: '#F7F7F7',
  surface: '#FFFFFF',
  border: '#ECECEC',
  borderStrong: '#C8C8C8',
  text: '#1A1A1A',
  textMuted: '#666666',
  textSubtle: '#999999',
  primary: '#2E7D32',
  onPrimary: '#FFFFFF',
  disabled: '#BDBDBD',
  danger: '#C62828',
  dangerBackground: '#FFEBEE',
  dangerText: '#B71C1C',
  successBackground: '#E8F5E9',
  successText: '#1B5E20',
  warningBackground: '#FFF8E1',
  warningText: '#8D6E00',
  infoBackground: '#E3F2FD',
  infoText: '#0D47A1',
  triggerBackground: '#FFF3E0',
  triggerText: '#E65100',
  shadow: '#000000',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  border: '#2C2C2C',
  borderStrong: '#3D3D3D',
  text: '#F2F2F2',
  textMuted: '#A8A8A8',
  textSubtle: '#6F6F6F',
  primary: '#43A047',
  onPrimary: '#FFFFFF',
  disabled: '#424242',
  danger: '#E53935',
  dangerBackground: '#3B1F1F',
  dangerText: '#FF8A80',
  successBackground: '#1E3323',
  successText: '#81C784',
  warningBackground: '#3A3220',
  warningText: '#FFD54F',
  infoBackground: '#1A2A3A',
  infoText: '#90CAF9',
  triggerBackground: '#3A2A1A',
  triggerText: '#FFB74D',
  shadow: '#000000',
};
