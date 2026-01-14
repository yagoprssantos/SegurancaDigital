'use client';

import { useMemo, useState } from 'react';

import {
  ErrorBanner,
  HowItWorks,
  PrimaryButton,
  SecondaryButton,
  ToolCard,
  ToolField,
  ToolGrid,
  ToolInput,
  ToolModeSwitch,
  ToolTextarea,
  usePersistentToolMode,
} from '@/components/tool-kit';
import { apiPost } from '@/lib/api';
import { toHex } from '@/lib/bytes';

type VigenereEncryptResponse = { cipherHex: string };
type VigenereDecryptResponse = { message: string };

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

export default function VigenerePage() {
  const [mode, setMode] = usePersistentToolMode();
  const [password, setPassword] = useState('senha');
  const [message, setMessage] = useState('Mensagem de teste');
  const [cipherHex, setCipherHex] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const msgLowBytes = useMemo(() => {
    const s = message ?? '';
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
    return out;
  }, [message]);

  const keyLowBytes = useMemo(() => {
    const s = password ?? '';
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
    return out;
  }, [password]);

  const clientCipherHex = useMemo(() => {
    if (mode !== 'debug') return null;
    try {
      return vigenereEncryptHexLikeBackend(message ?? '', password ?? '');
    } catch {
      return null;
    }
  }, [mode, message, password]);

  const clientDecryptPreview = useMemo(() => {
    if (mode !== 'debug') return null;
    if (!cipherHex.trim()) return null;
    try {
      return vigenereDecryptHexLikeBackend(cipherHex, password ?? '');
    } catch {
      return null;
    }
  }, [mode, cipherHex, password]);

  async function encrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<VigenereEncryptResponse>('/vigenere/encrypt', {
        message,
        password,
      });
      setCipherHex(out.cipherHex);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setBusy(false);
    }
  }

  async function decrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<VigenereDecryptResponse>('/vigenere/decrypt', {
        cipherHex,
        password,
      });
      setMessage(out.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 sm:gap-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Criptografia Vigenère (XOR)
          </h1>
          <ToolModeSwitch mode={mode} onChange={setMode} />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          Cifra/decifra por XOR, com saída em hexadecimal.
        </p>
      </div>

      <HowItWorks
        mode={mode}
        steps={[
          'Converta a mensagem e a senha para bytes (UTF-8).',
          'Repita a senha até ter o mesmo tamanho da mensagem.',
          'Para cada posição i: cipher[i] = message[i] XOR key[i].',
          'Mostre o resultado em hexadecimal.',
          'Para decifrar, aplique o XOR novamente: message = cipher XOR key.',
        ]}
        debugCode={`// XOR com chave repetida\nfor i in 0..n-1:\n  out[i] = msg[i] ^ key[i % keyLen]\n\n// hex\nhex = toHex(out)`}
        debugExtras={
          <div className="grid gap-3">
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">
                Mensagem (charCode low-byte → hex)
              </div>
              <div className="font-mono text-xs text-zinc-300">
                {toHex(msgLowBytes)} ({msgLowBytes.length} bytes)
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">
                Senha (charCode low-byte → hex)
              </div>
              <div className="font-mono text-xs text-zinc-300">
                {toHex(keyLowBytes)} ({keyLowBytes.length} bytes)
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Cipher (preview no browser)</div>
              <div className="font-mono text-xs text-zinc-300">
                {clientCipherHex ?? '(senha vazia)'}
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">
                Decifra (preview a partir do hex)
              </div>
              <div className="text-xs text-zinc-300">
                {clientDecryptPreview ?? '(hex inválido ou vazio)'}
              </div>
            </div>
          </div>
        }
      />

      <ToolCard loading={busy}>
        <ToolGrid>
          <ToolField
            label="Senha"
            debugInfo={
              mode === 'debug' && password
                ? `${keyLowBytes.length} bytes`
                : undefined
            }
            hint={
              mode === 'debug'
                ? 'No debug, o XOR é calculado localmente em tempo real.'
                : undefined
            }
          >
            <ToolInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </ToolField>

          <ToolField
            label="Mensagem"
            debugInfo={
              mode === 'debug' && message
                ? `${msgLowBytes.length} bytes`
                : undefined
            }
          >
            <ToolTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </ToolField>
        </ToolGrid>

        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton loading={busy} disabled={busy} onClick={encrypt}>
            Cifrar (backend)
          </PrimaryButton>
          <SecondaryButton
            loading={busy}
            disabled={busy || cipherHex.trim().length === 0}
            onClick={decrypt}
          >
            Decifrar (backend)
          </SecondaryButton>
        </div>

        <ToolField
          label="Cipher (hex)"
          debugInfo={
            mode === 'debug' && cipherHex
              ? `${cipherHex.length / 2} bytes`
              : undefined
          }
        >
          <ToolTextarea
            value={cipherHex}
            onChange={(e) => setCipherHex(e.target.value)}
            className="font-mono text-xs"
          />
        </ToolField>

        {error && <ErrorBanner message={error} />}
      </ToolCard>
    </div>
  );
}
