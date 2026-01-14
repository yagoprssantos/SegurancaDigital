export function utf8ToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

export function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

export function fromHex(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/i, '');
  if (clean.length % 2 !== 0) throw new Error('hex inválido: tamanho ímpar');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = clean.slice(2 * i, 2 * i + 2);
    const n = Number.parseInt(byte, 16);
    if (Number.isNaN(n)) throw new Error('hex inválido');
    out[i] = n;
  }
  return out;
}

export function base64ToBytes(b64: string): Uint8Array {
  const s = b64.trim();
  if (!s) return new Uint8Array();

  if (typeof atob === 'function') {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  throw new Error('Base64 decode indisponível neste ambiente');
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  }
  throw new Error('Base64 encode indisponível neste ambiente');
}

export function xorRepeat(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (key.length === 0) throw new Error('key vazia');
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length];
  return out;
}
