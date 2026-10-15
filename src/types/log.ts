// Yemek kategorisi: sadece bu 3 değerden biri olabilir
export type MealCategory = 'home' | 'restaurant' | 'packaged';

// Tetikleyici etiketler
export type TriggerTag = 'spicy' | 'dairy' | 'gluten' | 'fried';

// Semptomlar
export type Symptom = 'bloating' | 'reflux' | 'cramp';

// Şiddet derecesi: sadece 1, 2, 3, 4 veya 5 olabilir
export type Severity = 1 | 2 | 3 | 4 | 5;

// Sunucuya gönderilme durumu
export type SyncStatus = 'pending' | 'synced' | 'failed';

// Bir kaydın tamamı
export interface LogEntry {
  id: string;
  foodName: string;
  category: MealCategory;
  triggers: TriggerTag[];
  symptoms: Symptom[];
  severity: Severity;
  createdAt: string;
  status: SyncStatus;
}

// Formdan gelen bilgiler: id, tarih ve durum henüz yok, onları store ekleyecek
export type NewLogInput = Omit<LogEntry, 'id' | 'createdAt' | 'status'>;
