import { MealCategory, Severity } from '../types/log';

// Formda zorunlu olan alanlar
export interface LogFormValues {
  foodName: string;
  category: MealCategory | null;
  severity: Severity | null;
}

// Her alan için (varsa) bir hata mesajı
export type LogFormErrors = Partial<Record<keyof LogFormValues, string>>;

export const FOOD_NAME_MAX_LENGTH = 60;

export function validateLogForm(values: LogFormValues): LogFormErrors {
  const errors: LogFormErrors = {};
  const name = values.foodName.trim();

  if (name.length === 0) {
    errors.foodName = 'Yemek adı boş bırakılamaz.';
  } else if (name.length < 2) {
    errors.foodName = 'Yemek adı en az 2 karakter olmalı.';
  }

  if (values.category === null) {
    errors.category = 'Bir kategori seç.';
  }

  if (values.severity === null) {
    errors.severity = 'Şiddet derecesini seç.';
  }

  return errors;
}
