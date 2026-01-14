'use client';

import { useMemo, useState } from 'react';

import {
  ErrorBanner,
  HowItWorks,
  PrimaryButton,
  ToolCard,
  ToolField,
  ToolGrid,
  ToolInput,
  ToolModeSwitch,
  ToolTextarea,
  usePersistentToolMode,
} from '@/components/tool-kit';
import { apiPost } from '@/lib/api';
import { fromHex } from '@/lib/bytes';

type BreakVigenereResponse = {
  key: string;
  plaintextGuess: string;
  cipherHex: string;
};

function vigenereDecryptHexLikeBackend(
  cipherHex: string,
  password: string
): string {
  if (!password || password.length === 0) throw new Error('password vazia');
  const clean = cipherHex.trim();
  if (clean.length % 2 !== 0) throw new Error('cipherHex deve ter tamanho par');
  let out = '';
  for (let i = 0; i < clean.length; i += 2) {
    const c = Number.parseInt(clean.slice(i, i + 2), 16);
    if (Number.isNaN(c)) throw new Error('cipherHex inválido');
    const p = password.charCodeAt((i / 2) % password.length);
    const m = (c ^ p) & 0xffff;
    out += String.fromCharCode(m);
  }
  return out;
}

function vigenereEncryptHexLikeBackend(
  message: string,
  password: string
): string {
  if (!password || password.length === 0) throw new Error('password vazia');
  let out = '';
  for (let i = 0; i < message.length; i++) {
    const m = message.charCodeAt(i);
    const p = password.charCodeAt(i % password.length);
    const c = (m ^ p) & 0xff;
    out += c.toString(16).padStart(2, '0');
  }
  return out;
}

export default function QuebraVigenerePage() {
  const [mode, setMode] = usePersistentToolMode();
  const [keyLength, setKeyLength] = useState(9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BreakVigenereResponse | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<BreakVigenereResponse>('/quebra-vigenere/run', {
        keyLength,
      });
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setBusy(false);
    }
  }

  const debugVerify = useMemo(() => {
    if (mode !== 'debug') return null;
    if (!result) return null;
    try {
      const decrypted = vigenereDecryptHexLikeBackend(
        result.cipherHex,
        result.key
      );
      const reenc = vigenereEncryptHexLikeBackend(
        result.plaintextGuess,
        result.key
      );
      const bytes = fromHex(result.cipherHex);

      const sample = [] as Array<{
        i: number;
        c: number;
        k: number;
        m: number;
      }>;
      const max = Math.min(16, bytes.length);
      for (let i = 0; i < max; i++) {
        const c = bytes[i];
        const k = result.key.charCodeAt(i % result.key.length) & 0xff;
        const m = (c ^ k) & 0xff;
        sample.push({ i, c, k, m });
      }

      return {
        decryptedMatches: decrypted === result.plaintextGuess,
        reencryptMatches: reenc === result.cipherHex,
        sample,
      };
    } catch {
      return null;
    }
  }, [mode, result]);

  return (
    <div className="grid gap-6 sm:gap-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Quebra Vigenère (hardcoded)
          </h1>
          <ToolModeSwitch mode={mode} onChange={setMode} />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          Executa o ataque estatístico usando o criptograma hardcoded do backend
          (como no projeto original).
        </p>
      </div>

      <HowItWorks
        mode={mode}
        steps={[
          'O backend mantém um criptograma fixo (hex).',
          'Escolha um tamanho de chave (3..12).',
          'Para cada posição da chave, o backend mede a frequência dos bytes naquele deslocamento.',
          'Assume que o byte mais comum naquele deslocamento corresponde a espaço (0x20).',
          'Então: key[pos] = mostCommonByte XOR 0x20.',
          'Com a chave estimada, o backend decifra via XOR e retorna um plaintext de tentativa.',
        ]}
        debugCode={`// Backend (ideia) – para cada pos da chave\nfor pos in 0..keyLen-1:\n  freq[0..255] = 0\n  for each cipherByte at index i where (i % keyLen) == pos:\n    freq[cipherByte]++\n  mostCommon = argmax(freq)\n  key[pos] = mostCommon XOR 0x20 // supõe espaço\n\nplaintext[i] = cipher[i] XOR key[i % keyLen]`}
        debugExtras={
          result ? (
            <div className="grid gap-3">
              <div className="grid gap-1 text-sm">
                <div className="text-zinc-200">
                  Validação local (mesma regra do backend)
                </div>
                <div className="text-xs text-zinc-400">
                  {debugVerify
                    ? `decrypt: ${
                        debugVerify.decryptedMatches ? 'ok' : 'dif'
                      } • re-encrypt: ${
                        debugVerify.reencryptMatches ? 'ok' : 'dif'
                      }`
                    : '—'}
                </div>
              </div>
              {debugVerify && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-2 text-xs font-semibold text-zinc-200">
                    Primeiros bytes (c ^ k = m)
                  </div>
                  <div className="grid gap-1 font-mono text-[11px] text-zinc-300">
                    {debugVerify.sample.map((row) => (
                      <div key={row.i}>
                        i={row.i.toString().padStart(2, '0')} c=0x
                        {row.c.toString(16).padStart(2, '0')} k=0x
                        {row.k.toString(16).padStart(2, '0')} m=0x
                        {row.m.toString(16).padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-xs text-zinc-400">
                Cipher size: {result.cipherHex.length / 2} bytes
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-400">
              Execute a quebra para ver os detalhes.
            </div>
          )
        }
      />

      <ToolCard loading={busy}>
        <ToolField
          label="Tamanho da chave (3..12)"
          hint={
            mode === 'debug'
              ? 'No debug, você também verá validação local e mapeamento byte a byte.'
              : undefined
          }
        >
          <ToolInput
            type="number"
            min={3}
            max={12}
            value={keyLength}
            onChange={(e) => setKeyLength(Number(e.target.value))}
          />
        </ToolField>

        <PrimaryButton
          loading={busy}
          disabled={busy}
          onClick={run}
          className="w-fit"
        >
          Rodar quebra (backend)
        </PrimaryButton>

        {result && (
          <ToolGrid>
            <ToolField label="Chave estimada">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-zinc-100">
                {result.key}
              </div>
            </ToolField>

            <ToolField label="Plaintext (estimativa)">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100">
                {result.plaintextGuess}
              </div>
            </ToolField>
          </ToolGrid>
        )}

        {result && (
          <div className="grid gap-3">
            <ToolField label="Cipher (hex)">
              <ToolTextarea
                readOnly
                value={result.cipherHex}
                className="min-h-24 font-mono text-xs"
              />
            </ToolField>

            {mode === 'debug' && (
              <ToolField label="Cipher (hex) – primeiros 64 chars">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-zinc-200">
                  {result.cipherHex.slice(0, 64)}
                  {result.cipherHex.length > 64 ? '…' : ''}
                </div>
              </ToolField>
            )}
          </div>
        )}

        {error && <ErrorBanner message={error} />}
      </ToolCard>
    </div>
  );
}
