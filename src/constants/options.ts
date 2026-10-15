import { MealCategory, Symptom, TriggerTag } from '../types/log';

export const CATEGORY_OPTIONS: { value: MealCategory; label: string }[] = [
  { value: 'home', label: 'Home Cooked / Ev Yemeği' },
  { value: 'restaurant', label: 'Restaurant / Restoran' },
  { value: 'packaged', label: 'Packaged / Paketli' },
];

export const TRIGGER_OPTIONS: { value: TriggerTag; label: string }[] = [
  { value: 'spicy', label: 'Spicy / Acılı' },
  { value: 'dairy', label: 'Dairy / Süt Ürünü' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'fried', label: 'Fried / Kızartma' },
];

export const SYMPTOM_OPTIONS: { value: Symptom; label: string }[] = [
  { value: 'bloating', label: 'Bloating / Şişkinlik' },
  { value: 'reflux', label: 'Reflux / Reflü' },
  { value: 'cramp', label: 'Stomach Cramp / Mide Krampı' },
];