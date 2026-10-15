import { postLog } from '../../services/api';
import { NewLogInput } from '../../types/log';
import { useLogStore } from '../useLogStore';

// Testte gerçek telefon deposu yok → AsyncStorage'ın sahte versiyonunu kullan
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// API'yi de sahteleştir: her testte başarılı mı başarısız mı olacağına biz karar verelim
jest.mock('../../services/api', () => ({
  postLog: jest.fn(),
}));
const mockedPostLog = postLog as jest.MockedFunction<typeof postLog>;

const sampleInput: NewLogInput = {
  foodName: 'Menemen',
  category: 'home',
  triggers: ['dairy'],
  symptoms: ['bloating'],
  severity: 2,
};

describe('useLogStore', () => {
  beforeEach(() => {
    // Her testten önce store'u sıfırla
    useLogStore.setState({ logs: [], unseenCount: 0, syncingIds: [] });
    mockedPostLog.mockReset();
  });

  it('addLog kaydı "pending" durumuyla en başa ekler', () => {
    const first = useLogStore.getState().addLog(sampleInput);
    const second = useLogStore.getState().addLog({ ...sampleInput, foodName: 'Pilav' });

    const { logs, unseenCount } = useLogStore.getState();
    expect(logs).toHaveLength(2);
    expect(logs[0].id).toBe(second.id); // en yeni en üstte
    expect(logs[1].id).toBe(first.id);
    expect(first.status).toBe('pending');
    expect(unseenCount).toBe(2);
  });

  it('API başarılıysa kayıt "synced" olur', async () => {
    mockedPostLog.mockResolvedValue({ id: 'x', receivedAt: 'now' });
    const entry = useLogStore.getState().addLog(sampleInput);

    const success = await useLogStore.getState().syncLog(entry.id);

    expect(success).toBe(true);
    expect(useLogStore.getState().logs[0].status).toBe('synced');
    expect(useLogStore.getState().syncingIds).toEqual([]);
  });

  it('API hata verirse kayıt "failed" olur ama silinmez (offline-first)', async () => {
    mockedPostLog.mockRejectedValue(new Error('Ağ hatası'));
    const entry = useLogStore.getState().addLog(sampleInput);

    const success = await useLogStore.getState().syncLog(entry.id);

    expect(success).toBe(false);
    expect(useLogStore.getState().logs).toHaveLength(1); // kayıt hâlâ duruyor
    expect(useLogStore.getState().logs[0].status).toBe('failed');
  });

  it('removeLog kaydı siler', () => {
    const entry = useLogStore.getState().addLog(sampleInput);
    useLogStore.getState().removeLog(entry.id);
    expect(useLogStore.getState().logs).toHaveLength(0);
  });

  it('markAllSeen görülmemiş sayısını sıfırlar', () => {
    useLogStore.getState().addLog(sampleInput);
    useLogStore.getState().markAllSeen();
    expect(useLogStore.getState().unseenCount).toBe(0);
  });
});
