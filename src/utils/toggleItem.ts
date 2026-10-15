// Listede varsa çıkarır, yoksa ekler (her zaman YENİ bir liste döndürür)
export function toggleItem<T>(list: T[], item: T): T[] {
  if (list.includes(item)) {
    return list.filter((x) => x !== item);
  }
  return [...list, item];
}
