// ISO tarihini okunabilir hale getirir. Örn: "16 Ekim 2026 · 01:30"
export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${day} · ${time}`;
}
