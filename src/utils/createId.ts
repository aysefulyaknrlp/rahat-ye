// Her kayıt için benzersiz bir kimlik üretir. Örn: "mgs8k2x1-4f9a2c"
export function createId(): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${timePart}-${randomPart}`;
}
