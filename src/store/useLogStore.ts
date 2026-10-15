import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { postLog } from '../services/api';
import { LogEntry, NewLogInput, SyncStatus } from '../types/log';
import { createId } from '../utils/createId';

// Store'un şablonu: içinde hangi veri ve hangi fonksiyonlar var?
interface LogState {
  logs: LogEntry[];
  unseenCount: number; // Geçmiş ekranında henüz görülmemiş yeni kayıt sayısı
  syncingIds: string[]; // Şu an sunucuya gönderilmekte olan kayıtlar (telefona kaydedilmez)
  addLog: (input: NewLogInput) => LogEntry;
  updateLogStatus: (id: string, status: SyncStatus) => void;
  removeLog: (id: string) => void;
  markAllSeen: () => void;
  syncLog: (id: string) => Promise<boolean>;
  syncPendingLogs: () => void;
  retryFailedLogs: () => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set, get) => ({
      // Başlangıçta hiç kayıt yok
      logs: [],
      unseenCount: 0,
      syncingIds: [],

      // Yeni kayıt ekler. Önce telefona "pending" olarak yazılır (offline-first)
      addLog: (input) => {
        const entry: LogEntry = {
          ...input,
          id: createId(),
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        // En yeni kayıt en başa. Ayrıca "görülmemiş" sayısını 1 artır
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

      // Bir kaydı sunucuya gönderir. Başarılıysa true, değilse false döner
      syncLog: async (id) => {
        const log = get().logs.find((item) => item.id === id);
        // Kayıt yoksa ya da zaten gönderiliyorsa tekrar gönderme
        if (!log || get().syncingIds.includes(id)) return false;

        // 1) "Gönderiliyor" listesine ekle, durumu pending yap
        set((state) => ({ syncingIds: [...state.syncingIds, id] }));
        get().updateLogStatus(id, 'pending');

        try {
          // 2) Sahte API'ye gönder ve cevabı bekle (1.5 sn)
          await postLog(log);
          // 3a) Başarılı → synced
          get().updateLogStatus(id, 'synced');
          return true;
        } catch {
          // 3b) Hata → failed (kayıt silinmez, telefonda güvende)
          get().updateLogStatus(id, 'failed');
          return false;
        } finally {
          // 4) Her durumda "gönderiliyor" listesinden çıkar
          set((state) => ({ syncingIds: state.syncingIds.filter((x) => x !== id) }));
        }
      },

      // Uygulama açılınca: önceden gönderilemeyen "pending" kayıtları gönder
      syncPendingLogs: () => {
        get()
          .logs.filter((log) => log.status === 'pending')
          .forEach((log) => {
            void get().syncLog(log.id);
          });
      },

      // Başarısız olan tüm kayıtları tekrar gönder
      retryFailedLogs: () => {
        get()
          .logs.filter((log) => log.status === 'failed')
          .forEach((log) => {
            void get().syncLog(log.id);
          });
      },
    }),
    {
      name: 'rahat-ye-logs', // Telefonda verinin kaydedileceği anahtar
      storage: createJSONStorage(() => AsyncStorage), // Nereye kaydedilecek?
      version: 1, // Veri yapısı değişirse ileride geçiş (migration) için
      // Sadece kalıcı olması gereken verileri sakla (syncingIds geçici, saklanmaz)
      partialize: (state) => ({ logs: state.logs, unseenCount: state.unseenCount }),
    },
  ),
);
