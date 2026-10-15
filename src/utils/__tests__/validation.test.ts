import { validateLogForm } from '../validation';

describe('validateLogForm', () => {
  // Geçerli bir form örneği (her testte bunu değiştirerek kullanıyoruz)
  const validValues = {
    foodName: 'Mercimek çorbası',
    category: 'home' as const,
    severity: 3 as const,
  };

  it('tüm zorunlu alanlar doluysa hata döndürmez', () => {
    expect(validateLogForm(validValues)).toEqual({});
  });

  it('yemek adı boşsa hata verir', () => {
    const errors = validateLogForm({ ...validValues, foodName: '' });
    expect(errors.foodName).toBe('Yemek adı boş bırakılamaz.');
  });

  it('yemek adı sadece boşluksa boş sayar', () => {
    const errors = validateLogForm({ ...validValues, foodName: '    ' });
    expect(errors.foodName).toBe('Yemek adı boş bırakılamaz.');
  });

  it('yemek adı 2 karakterden kısaysa hata verir', () => {
    const errors = validateLogForm({ ...validValues, foodName: 'a' });
    expect(errors.foodName).toBe('Yemek adı en az 2 karakter olmalı.');
  });

  it('kategori seçilmemişse hata verir', () => {
    const errors = validateLogForm({ ...validValues, category: null });
    expect(errors.category).toBeDefined();
  });

  it('şiddet seçilmemişse hata verir', () => {
    const errors = validateLogForm({ ...validValues, severity: null });
    expect(errors.severity).toBeDefined();
  });

  it('boş formda 3 hata döndürür', () => {
    const errors = validateLogForm({ foodName: '', category: null, severity: null });
    expect(Object.keys(errors)).toHaveLength(3);
  });
});
