import { LogEntry } from '../types/log';

// Sahte (mock) API ayarları
export const MOCK_API_CONFIG = {
  delayMs: 1500, // Ağ gecikmesi: 1.5 saniye
  failureRate: 0.1, // Hata olasılığı: %10
};

export interface PostLogResponse {
  id: string;
  receivedAt: string;
}

// POST /api/logs isteğini taklit eder
export function postLog(entry: LogEntry): Promise<PostLogResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < MOCK_API_CONFIG.failureRate) {
        reject(new Error('Ağ hatası: sunucuya ulaşılamadı.'));
      } else {
        resolve({ id: entry.id, receivedAt: new Date().toISOString() });
      }
    }, MOCK_API_CONFIG.delayMs);
  });
}
