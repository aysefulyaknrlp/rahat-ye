import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { LogEntry, NewLogInput, SyncStatus } from '../types/log';
import { createId } from '../utils/createId';

// Store'un şablonu: içinde hangi veri ve hangi fonksiyonlar var?
interface LogState {
  logs: LogEntry[];
  unseenCount: number; // Geçmiş ekranında henüz görülmemiş yeni kayıt sayısı
  addLog: (input: NewLogInput) => LogEntry;
  updateLogStatus: (id: string, status: SyncStatus) => void;
  removeLog: (id: string) => void;
  markAllSeen: () => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      // Başlangıçta hiç kayıt yok
      logs: [],
      unseenCount: 0,

      // Yeni kayıt ekler. Önce telefona "pending" olarak yazılır (offline-first)
      addLog: (input) => {
        const entry: LogEntry = {
          ...input,
          id: createId(),
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        // En yeni kayıt en başa
        // Ayrıca "görülmemiş" sayısını 1 artır
        set((state) => ({
          logs: [entry, ...state.logs],
          unseenCount: state.unseenCount + 1,
        }));
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

      // Geçmiş ekranı açılınca çağrılır: tüm kayıtlar görüldü
      markAllSeen: () => {
        set({ unseenCount: 0 });
      },
    }),
    {
      name: 'rahat-ye-logs', // Telefonda verinin kaydedileceği anahtar
      storage: createJSONStorage(() => AsyncStorage), // Nereye kaydedilecek?
      version: 1, // Veri yapısı değişirse ileride geçiş (migration) için
      partialize: (state) => ({ logs: state.logs, unseenCount: state.unseenCount }), // Fonksiyonlar hariç verileri sakla
    },
  ),
);
