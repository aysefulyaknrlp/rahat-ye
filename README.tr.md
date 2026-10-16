# Rahat Ye 🌿 — Hızlı Yemek ve Semptom Kaydı (PoC)

[🇬🇧 English](README.md) | **🇹🇷 Türkçe**

**Rahat Ye** için React Native (Expo) ile geliştirilmiş bir kavram kanıtı (proof of concept). Rahat Ye, Türkiye'de reflü, şişkinlik veya IBS gibi sindirim sorunları yaşayan kullanıcıların yediklerini ve sonrasında yaşadıkları şikayetleri kaydettiği bir yemek ve semptom günlüğüdür.

Temel fikir **offline-first** yaklaşımıdır: Kullanıcı internetin zayıf olduğu bir restoranda öğün kaydedebilir. Bu yüzden her kayıt önce telefona yazılır, ardından sunucuya gönderilir. Ağ isteği başarısız olsa bile veri asla kaybolmaz.

<p align="center">
  <img src="docs/demo.gif" alt="Rahat Ye demo: doğrulama, kayıt ekleme, ağ hatası sonrası tekrar deneme, geçmiş ekranı ve koyu tema" width="300" />
</p>

---

## ✨ Özellikler

### Görev 1 — Arayüz ve Form
- Tek sayfalık, kaydırılabilir **kayıt formu**: yemek adı, öğün kategorisi (Ev Yemeği / Restoran / Paketli), tetikleyici etiketler (Acılı, Süt Ürünü, Gluten, Kızartma), semptom chip'leri (Şişkinlik, Reflü, Mide Krampı) ve **1–5 şiddet** seçici
- **Doğrulama (validation):** Yemek adı, kategori ve şiddet girilene kadar Kaydet butonu pasif kalır. Yemek adı hatası alana dokunulduktan sonra gösterilir, eksik alanlar butonun altında listelenir
- Etkileşim geri bildirimi: chip ve butonlarda basılma efekti, klavyeye duyarlı kaydırma, erişilebilirlik etiketleri

### Görev 2 — State Yönetimi ve Çevrimdışı Kayıt
- **Zustand** ile merkezi state yönetimi, `persist` middleware ile **AsyncStorage**'a kalıcı kayıt
- Tarihe göre sıralı (en yeni en üstte) **Geçmiş ekranı** (`FlatList`). Her kartta yemek adı, tarih/saat, kategori, şiddet, tetikleyiciler, semptomlar ve gönderim durumu görünür
- Karta basılı tutarak silme, kayıt yokken bilgilendirici boş ekran
- Geçmiş sekmesinde, kullanıcının henüz görmediği kayıtlar için rozet

### Görev 3 — Sahte API ve Ağ Yönetimi
- **1.5 saniye gecikmeli** ve **%10 rastgele hata** veren sahte `POST /api/logs`
- Gönderim sırasında yükleniyor animasyonu, başarı mesajı ve **Tekrar Dene** butonlu hata mesajı
- Her kaydın bir gönderim durumu var: `pending` (bekliyor) → `synced` (gönderildi) / `failed` (gönderilemedi)
- Başarısız kayıtlar Geçmiş ekranından tek tek veya toplu olarak yeniden gönderilebilir
- Önceki oturumdan `pending` kalan kayıtlar uygulama açılınca otomatik gönderilir

### Bonus
- Tüm veri modelleri, props ve navigasyon rotaları için **strict TypeScript**
- Telefonun ayarını takip eden **açık / koyu tema**
- Doğrulama, yardımcı fonksiyonlar, sahte API ve store için **Jest birim testleri** (18 test)

---

## 🔄 Offline-first veri akışı

```
Kaydet'e basıldı
  │
  ├─ 1. addLog()  → Zustand store → persist → AsyncStorage   (durum: pending)
  │                                                           veri telefonda güvende
  └─ 2. syncLog() → POST /api/logs (sahte: 1.5 sn, %10 hata)
            ├─ başarılı → durum: synced  ✅
            └─ hata     → durum: failed  ⚠️  → "Tekrar Dene" (kayıt silinmez)
```

---

## 🛠 Teknolojiler ve tercih nedenleri

| Alan | Tercih | Neden |
|---|---|---|
| Framework | **Expo (SDK 57)** + React Native | Hızlı kurulum; native ayar gerektirmeden Expo Go ile telefonda test |
| Dil | **TypeScript (strict)** | Geçersiz veriyi (örneğin 6 şiddet değeri veya tanımsız bir kategori) kod çalışmadan yakalar |
| State | **Zustand** | Bu boyuttaki bir uygulama için Redux'a göre çok daha az kod; basit selector'lar ve hazır `persist` middleware |
| Depolama | **AsyncStorage** | Expo Go'da ek kurulum olmadan çalışır. MMKV daha hızlıdır ancak development build gerektirir; geçiş için sadece `persist`'in `storage` ayarını değiştirmek yeterli |
| Navigasyon | **React Navigation 7** (alt sekmeler) | Sektör standardı; tiplendirilmiş rota parametreleri; özel tasarım yüzen tab bar |
| Test | **Jest** + `jest-expo` | İş mantığı arayüzden ayrıldığı için ekran çizmeden test edilebiliyor |

---

## 🚀 Kurulum

**Gereksinimler:** Node.js (LTS) ve telefonda **Expo Go** uygulaması ya da iOS Simulator (Xcode) / Android Emulator.

```bash
git clone <repo-adresi>
cd rahat-ye
npm install
npx expo start
```

- **Telefon:** QR kodu kamerayla (iOS) veya Expo Go uygulamasıyla (Android) okut
- **iOS Simulator:** Terminalde `i` tuşuna bas
- **Android Emulator:** Terminalde `a` tuşuna bas

### Testler ve tip kontrolü

```bash
npm test          # Jest birim testleri
npx tsc --noEmit  # TypeScript kontrolü
```

### Hata / tekrar dene akışını denemek
%10 hata olasılığını istenen anda tetiklemek zordur. Geliştirme modunda formun en altında **"🧪 Ağ hatası simülasyonu"** düğmesi bulunur; açıldığında her istek başarısız olur. Bu düğme `__DEV__` kontrolüyle sarıldığı için yayınlanan uygulamada görünmez.

Koyu temayı iOS Simulator'da denemek için `Cmd + Shift + A` tuşlarına bas.

---

## 📁 Proje yapısı

```
src/
├── components/   Tekrar kullanılabilir arayüz parçaları: Chip, SeveritySelector,
│                 PrimaryButton, LogCard, StatusBanner, FloatingTabBar, DevNetworkToggle
├── constants/    Seçenek listeleri (kategoriler, tetikleyiciler, semptomlar) ve şiddet seviyeleri
├── navigation/   Alt sekme navigasyonu ve tiplendirilmiş rota parametreleri
├── screens/      LogScreen (form) ve HistoryScreen (liste)
├── services/     Sahte API (POST /api/logs)
├── store/        AsyncStorage'a kalıcı Zustand store ve gönderim mantığı
├── theme/        Açık/koyu renk paletleri ve tema hook'ları
├── types/        Veri modelleri (LogEntry, Severity, SyncStatus, …)
└── utils/        Saf yardımcı fonksiyonlar: doğrulama, toggleItem, id üretme, tarih formatlama
```

Testler, test ettikleri kodun yanındaki `__tests__` klasörlerinde bulunur.

---

## ⚖️ Ödünleşimler ve gelecek geliştirmeler

- **Gerçek backend yok.** Gerçek bir sunucuya geçmek için sadece `src/services/api.ts` dosyasında `fetch` kullanmak yeterli.
- **Bağlantı gelince otomatik gönderim.** Bekleyen kayıtlar şu an uygulama açılışında gönderiliyor; ağ değişikliklerini dinleyerek (örneğin `@react-native-community/netinfo`) internet gelir gelmez gönderilebilir.
- **Artan aralıklarla yeniden deneme.** Tekrar deneme şu an manuel; exponential backoff ile otomatik yapılabilir.
- **Kayıt düzenleme.** Kayıtlar oluşturulup silinebiliyor ama henüz düzenlenemiyor.
- **İstatistik ekranı.** Örneğin "Hangi tetikleyicilerden sonra en çok şiddetli semptom yaşanıyor?"
- **Depolama ölçeği.** AsyncStorage bir PoC için yeterli; binlerce kayıt için SQLite veya MMKV daha uygun olur.
- **Component testleri.** Mevcut testler iş mantığını kapsıyor; React Native Testing Library ile ekran testleri eklenebilir.
- **Çoklu dil desteği.** Etiketler şu an tek bir metinde iki dilli (EN / TR); düzgün bir i18n yapısıyla dil değiştirilebilir hale getirilebilir.
