import { Severity } from '../types/log';

// Şiddet seviyeleri: hafiften şiddetliye, yeşilden kırmızıya
export const SEVERITY_LEVELS: { value: Severity; color: string; label: string }[] = [
  { value: 1, color: '#2E7D32', label: 'Çok hafif' },
  { value: 2, color: '#7CB342', label: 'Hafif' },
  { value: 3, color: '#F9A825', label: 'Orta' },
  { value: 4, color: '#EF6C00', label: 'Şiddetli' },
  { value: 5, color: '#C62828', label: 'Çok şiddetli' },
];

// Bir şiddet değerinin rengini verir. Örn: 5 → kırmızı
export function getSeverityColor(severity: Severity): string {
  return SEVERITY_LEVELS.find((level) => level.value === severity)?.color ?? '#999';
}
