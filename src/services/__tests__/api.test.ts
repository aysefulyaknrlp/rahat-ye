import { LogEntry } from '../../types/log';
import { MOCK_API_CONFIG, postLog } from '../api';

const sampleLog: LogEntry = {
  id: 'test-1',
  foodName: 'Lahmacun',
  category: 'restaurant',
  triggers: ['spicy'],
  symptoms: ['reflux'],
  severity: 4,
  createdAt: '2026-10-16T10:00:00.000Z',
  status: 'pending',
};

describe('postLog (mock API)', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Gerçekten 1.5 sn beklememek için sahte zaman
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('1.5 saniye sonra başarılı cevap döner', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 ≥ 0.1 → hata yok

    const promise = postLog(sampleLog);
    jest.advanceTimersByTime(MOCK_API_CONFIG.delayMs); // Zamanı 1.5 sn ileri sar

    await expect(promise).resolves.toMatchObject({ id: 'test-1' });
  });

  it('rastgele sayı %10 sınırının altındaysa hata verir', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.05); // 0.05 < 0.1 → hata

    const promise = postLog(sampleLog);
    jest.advanceTimersByTime(MOCK_API_CONFIG.delayMs);

    await expect(promise).rejects.toThrow('Ağ hatası');
  });

  it('1.5 saniye dolmadan cevap vermez', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const onDone = jest.fn();

    postLog(sampleLog).then(onDone);
    jest.advanceTimersByTime(1000); // Sadece 1 sn geçti

    expect(onDone).not.toHaveBeenCalled();
  });
});
