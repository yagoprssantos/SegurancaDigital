'use client';

import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

import {
  AnimatedResult,
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
import { tools } from '@/lib/tools';

type VigenereEncryptResponse = { cipherHex: string };
type VigenereDecryptResponse = { message: string };

const TOOL = tools.find((t) => t.href === '/tools/vigenere');

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

  const variant = mode === 'normal' ? 'beginner' : 'debug';

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
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              {TOOL && <TOOL.icon className="text-amber-300" size={18} />}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Criptografia Vigenère (XOR)
            </h1>
          </div>
          <ToolModeSwitch mode={mode} onChange={setMode} compact />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          {mode === 'normal'
            ? 'Transforma uma mensagem usando uma “senha” (chave) repetida. Você consegue desfazer a transformação usando a mesma senha.'
            : 'Cifra/decifra por XOR com chave repetida, com saída em hexadecimal.'}
        </p>

        {mode === 'normal' && TOOL && (
          <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
            <div>
              <div className="font-semibold text-zinc-100">O que é?</div>
              <div className="mt-1">{TOOL.beginner.what}</div>
            </div>
            <div>
              <div className="font-semibold text-zinc-100">Para que serve?</div>
              <div className="mt-1">{TOOL.beginner.why}</div>
            </div>
            <div>
              <div className="font-semibold text-zinc-100">Como usar</div>
              <div className="mt-1">{TOOL.beginner.how}</div>
              {TOOL.beginner.note && (
                <div className="mt-2 text-xs text-zinc-400">
                  Obs.: {TOOL.beginner.note}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <HowItWorks
        mode={mode}
        steps={
          mode === 'normal'
            ? [
                'Você escreve uma mensagem e uma senha (chave).',
                'A ferramenta mistura cada caractere da mensagem com a senha (que vai se repetindo).',
                'O resultado aparece em hex (um formato prático para representar bytes).',
                'Para voltar ao texto original, use a mesma senha e clique em “Decifrar”.',
              ]
            : [
                'Converta a mensagem e a senha para bytes (UTF-8).',
                'Repita a senha até ter o mesmo tamanho da mensagem.',
                'Para cada posição i: cipher[i] = message[i] XOR key[i].',
                'Mostre o resultado em hexadecimal.',
                'Para decifrar, aplique o XOR novamente: message = cipher XOR key.',
              ]
        }
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
              variant={variant}
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
              variant={variant}
            />
          </ToolField>
        </ToolGrid>

        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton
            loading={busy}
            disabled={busy}
            onClick={encrypt}
            variant={variant}
          >
            {mode === 'debug' ? 'Cifrar (backend)' : 'Cifrar'}
          </PrimaryButton>
          <SecondaryButton
            loading={busy}
            disabled={busy || cipherHex.trim().length === 0}
            onClick={decrypt}
            variant={variant}
          >
            {mode === 'debug' ? 'Decifrar (backend)' : 'Decifrar'}
          </SecondaryButton>
        </div>

        <AnimatedResult show={cipherHex.trim().length > 0}>
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
              className="font-mono text-xs min-h-20"
              variant={variant}
            />
          </ToolField>
        </AnimatedResult>

        <AnimatePresence>
          {error && <ErrorBanner message={error} />}
        </AnimatePresence>
      </ToolCard>
    </div>
  );
}
