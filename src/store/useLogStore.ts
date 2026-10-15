import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { LogEntry, NewLogInput, SyncStatus } from '../types/log';
import { createId } from '../utils/createId';

// Store'un şablonu: içinde hangi veri ve hangi fonksiyonlar var?
interface LogState {
  logs: LogEntry[];
  addLog: (input: NewLogInput) => LogEntry;
  updateLogStatus: (id: string, status: SyncStatus) => void;
  removeLog: (id: string) => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      // Başlangıçta hiç kayıt yok
      logs: [],

      // Yeni kayıt ekler. Önce telefona "pending" olarak yazılır (offline-first)
      addLog: (input) => {
        const entry: LogEntry = {
          ...input,
          id: createId(),
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        // En yeni kayıt en başa
        set((state) => ({ logs: [entry, ...state.logs] }));
        return entry;
      },

      // Bir kaydın durumunu değiştirir (pending → synced / failed)
      updateLogStatus: (id, status) => {
        set((state) => ({
          logs: state.logs.map((log) => (log.id === id ? { ...log, status } : log)),
        }));
      },

      // Bir kaydı siler
      removeLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }));
      },
    }),
    {
      name: 'rahat-ye-logs', // Telefonda verinin kaydedileceği anahtar
      storage: createJSONStorage(() => AsyncStorage), // Nereye kaydedilecek?
      version: 1, // Veri yapısı değişirse ileride geçiş (migration) için
      partialize: (state) => ({ logs: state.logs }), // Sadece kayıtları sakla
    },
  ),
);
