import { toggleItem } from '../toggleItem';

describe('toggleItem', () => {
  it('listede olmayan elemanı ekler', () => {
    expect(toggleItem(['spicy'], 'dairy')).toEqual(['spicy', 'dairy']);
  });

  it('listede olan elemanı çıkarır', () => {
    expect(toggleItem(['spicy', 'dairy'], 'spicy')).toEqual(['dairy']);
  });

  it('orijinal listeyi değiştirmez (immutability)', () => {
    const original = ['spicy'];
    const result = toggleItem(original, 'dairy');
    expect(original).toEqual(['spicy']); // eski liste aynı kaldı
    expect(result).not.toBe(original); // yeni bir liste döndü
  });
});
