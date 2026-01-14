'use client';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import {
  AnimatedResult,
  ErrorBanner,
  HowItWorks,
  PrimaryButton,
  SecondaryButton,
  ToolCard,
  ToolField,
  ToolInput,
  ToolModeSwitch,
  ToolTextarea,
  usePersistentToolMode,
} from '@/components/tool-kit';
import { apiPost } from '@/lib/api';
import { toHex, utf8ToBytes } from '@/lib/bytes';
import { tools } from '@/lib/tools';

type ShaResponse = { hashHex: string };

const TOOL = tools.find((t) => t.href === '/tools/sha256');

export default function Sha256Page() {
  const [mode, setMode] = usePersistentToolMode();
  const [text, setText] = useState('Olá mundo');
  const [hashHex, setHashHex] = useState('');
  const [clientHashHex, setClientHashHex] = useState<string | null>(null);
  const [clientBusy, setClientBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = mode === 'normal' ? 'beginner' : 'debug';

  const textBytes = useMemo(() => utf8ToBytes(text ?? ''), [text]);

  useEffect(() => {
    if (mode !== 'debug') return;
    let cancelled = false;

    async function calc() {
      try {
        setClientBusy(true);
        const digest = await crypto.subtle.digest(
          'SHA-256',
          textBytes as unknown as BufferSource
        );
        const bytes = new Uint8Array(digest);
        if (!cancelled) setClientHashHex(toHex(bytes));
      } catch {
        if (!cancelled) setClientHashHex(null);
      } finally {
        if (!cancelled) setClientBusy(false);
      }
    }

    calc();
    return () => {
      cancelled = true;
    };
  }, [mode, textBytes]);

  async function hashClient() {
    setClientBusy(true);
    try {
      const digest = await crypto.subtle.digest(
        'SHA-256',
        textBytes as unknown as BufferSource
      );
      setClientHashHex(toHex(new Uint8Array(digest)));
    } catch {
      setClientHashHex(null);
    } finally {
      setClientBusy(false);
    }
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<ShaResponse>('/sha256', { text });
      setHashHex(out.hashHex);
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
            <h1 className="text-3xl font-semibold tracking-tight">SHA-256</h1>
          </div>
          <ToolModeSwitch mode={mode} onChange={setMode} compact />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          {mode === 'normal'
            ? 'Hash é uma “impressão digital” do texto: é fácil gerar, mas muito difícil voltar ao texto original.'
            : 'Gera hash SHA-256 em hexadecimal.'}
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
            </div>
          </div>
        )}
      </div>

      <HowItWorks
        mode={mode}
        steps={
          mode === 'normal'
            ? [
                'Você digita um texto (entrada).',
                'O SHA-256 gera sempre um resultado do mesmo tamanho (saída em hex).',
                'Se você mudar uma letra, o hash muda bastante — isso é esperado.',
              ]
            : [
                'Converta o texto para bytes (UTF-8).',
                'Aplique padding e divida em blocos de 512 bits.',
                'Inicialize os registradores (H0..H7).',
                'Para cada bloco: expanda a mensagem (W0..W63) e rode 64 rounds de compressão.',
                'Ao final, concatene H0..H7 e imprima em hexadecimal.',
              ]
        }
        debugCode={`// Pseudocódigo (alto nível)\nbytes = utf8(text)\nblocks = pad_512(bytes)\nH = IV\nfor block in blocks:\n  W = message_schedule(block)\n  (a..h) = H\n  for i in 0..63:\n    T1 = h + Σ1(e) + Ch(e,f,g) + K[i] + W[i]\n    T2 = Σ0(a) + Maj(a,b,c)\n    h=g; g=f; f=e; e=d+T1; d=c; c=b; b=a; a=T1+T2\n  H = H + (a..h)\nhex = toHex(H)`}
        debugExtras={
          <div className="grid gap-3">
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Bytes (UTF-8 → hex)</div>
              <div className="font-mono text-xs text-zinc-300">
                {toHex(textBytes)} ({textBytes.length} bytes)
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Hash no browser (Web Crypto)</div>
              <div className="font-mono text-xs text-zinc-300">
                {clientBusy
                  ? 'calculando…'
                  : clientHashHex
                  ? clientHashHex
                  : 'indisponível'}
              </div>
              {clientHashHex && hashHex && (
                <div className="text-xs text-zinc-400">
                  {clientHashHex === hashHex
                    ? 'Bate com o backend.'
                    : 'Diferente do backend (confira entrada).'}
                </div>
              )}
            </div>
          </div>
        }
      />

      <ToolCard>
        <ToolField
          label="Texto"
          debugInfo={mode === 'debug' ? `${textBytes.length} bytes` : undefined}
        >
          <ToolTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-20"
            variant={variant}
          />
        </ToolField>

        <div className="flex gap-3">
          <PrimaryButton
            loading={busy}
            disabled={busy}
            onClick={run}
            className="w-fit"
            variant={variant}
          >
            Gerar hash
          </PrimaryButton>
          {mode === 'debug' && (
            <SecondaryButton
              loading={clientBusy}
              disabled={clientBusy}
              onClick={hashClient}
              variant={variant}
            >
              Calcular (navegador)
            </SecondaryButton>
          )}
        </div>

        <AnimatedResult show={hashHex.trim().length > 0}>
          <ToolField
            label="Hash (hex)"
            debugInfo={
              mode === 'debug' && hashHex
                ? `${hashHex.length / 2} bytes`
                : undefined
            }
          >
            <ToolInput
              readOnly
              value={hashHex}
              className="font-mono text-xs"
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
