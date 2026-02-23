/**
 * Hash determinístico para uso en el cliente (navegador).
 * En el servidor usa lib/hash.ts con crypto.
 */
export function fakeHash(input: string): string {
  let h = 0;
  const s = input + "segunda_salt_mvp";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h).toString(16).padStart(8, "0") + Date.now().toString(16).slice(-8);
}
