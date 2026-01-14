'use client';

import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

import {
  AnimatedContent,
  AnimatedResult,
  ErrorBanner,
  HowItWorks,
  PrimaryButton,
  ToolCard,
  ToolField,
  ToolInput,
  ToolModeSwitch,
  ToolTextarea,
  usePersistentToolMode,
} from '@/components/tool-kit';
import { apiPost } from '@/lib/api';
import { fromHex, toHex, utf8ToBytes } from '@/lib/bytes';
import { tools } from '@/lib/tools';

type BreakOtpResponse = { xorHex: string; cribHex: string; hint: string };

const TOOL = tools.find((t) => t.href === '/tools/quebra-otp');

export default function QuebraOtpPage() {
  const [mode, setMode] = usePersistentToolMode();
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(1);
  const [crib, setCrib] = useState(' the ');
  const [result, setResult] = useState<BreakOtpResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = mode === 'normal' ? 'beginner' : 'debug';

  const cribBytes = useMemo(() => utf8ToBytes(crib ?? ''), [crib]);
  const cribHexPreview = useMemo(() => toHex(cribBytes), [cribBytes]);
  const derivedPreview = useMemo(() => {
    if (mode !== 'debug') return null;
    if (!result) return null;
    try {
      const xorBytes = fromHex(result.xorHex);
      const n = Math.min(xorBytes.length, cribBytes.length);
      const derived = new Uint8Array(n);
      for (let i = 0; i < n; i++) derived[i] = xorBytes[i] ^ cribBytes[i];
      const derivedText = new TextDecoder('iso-8859-1').decode(derived);
      return { derivedText, derivedHex: toHex(derived) };
    } catch {
      return null;
    }
  }, [mode, result, cribBytes]);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<BreakOtpResponse>('/quebra-otp/run', {
        indexA,
        indexB,
        crib,
      });
      setResult(out);
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
              Quebra OTP reutilizado
            </h1>
          </div>
          <ToolModeSwitch mode={mode} onChange={setMode} compact />
        </div>
        <AnimatedContent mode={mode}>
          <p className="mt-2 text-base leading-relaxed text-zinc-300">
            {mode === 'normal'
              ? 'Mostra o que acontece quando a OTP é reutilizada (um erro grave): dá para extrair informação combinando duas mensagens cifradas.'
              : 'Selecione 2 criptogramas hardcoded e teste um berço (crib). O backend retorna XOR e o crib em hex.'}
          </p>

          {mode === 'normal' && TOOL && (
            <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
              <div>
                <div className="font-semibold text-zinc-100">O que é?</div>
                <div className="mt-1">{TOOL.beginner.what}</div>
              </div>
              <div>
                <div className="font-semibold text-zinc-100">
                  Para que serve?
                </div>
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
        </AnimatedContent>
      </div>

      <HowItWorks
        mode={mode}
        steps={
          mode === 'normal'
            ? [
                'Você escolhe duas mensagens cifradas que usaram a mesma OTP (isso não deveria acontecer).',
                'Você dá um “chute” de um pedaço de texto provável (crib), por exemplo “ the ”.',
                'A ferramenta combina as mensagens para tentar revelar pedaços do texto original.',
                'Você repete com outros cribs até aparecer algo legível.',
              ]
            : [
                'Pegue dois criptogramas C1 e C2 que foram cifrados com a mesma OTP (erro clássico).',
                'Compute XOR: X = C1 XOR C2 = P1 XOR P2 (o key stream cancela).',
                "Escolha um 'crib' (pedaço provável de texto) e alinhe em uma posição.",
                'Então você deriva um pedaço do outro plaintext: P2 = X XOR crib (ou P1, dependendo do alinhamento).',
                'Repita mudando crib/posições até encontrar texto legível.',
              ]
        }
        debugCode={`// Ideia central\nX = C1 XOR C2\n\n// Se você chuta que P1 contém crib em certo offset:\nP2_segment = X_segment XOR crib\n\n// No backend do demo (para os primeiros N bytes):\nderived[i] = crib[i] ^ c1[i] ^ c2[i]\n// e como xor[i] = c1[i] ^ c2[i], então:\nderived[i] = crib[i] ^ xor[i]`}
        debugExtras={
          <div className="grid gap-3">
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Crib (UTF-8 → hex)</div>
              <div className="font-mono text-xs text-zinc-300">
                {cribHexPreview} ({cribBytes.length} bytes)
              </div>
            </div>
            {result && (
              <div className="grid gap-1 text-sm">
                <div className="text-zinc-200">
                  Derivado no client (derived = crib XOR xor)
                </div>
                <div className="text-xs text-zinc-400">
                  {derivedPreview ? derivedPreview.derivedText : '—'}
                </div>
                {derivedPreview && (
                  <div className="font-mono text-xs text-zinc-300">
                    {derivedPreview.derivedHex}
                  </div>
                )}
              </div>
            )}
          </div>
        }
      />

      <ToolCard loading={busy}>
        <div className="grid gap-4 md:grid-cols-3">
          <ToolField label="Índice A">
            <ToolInput
              type="number"
              min={0}
              value={indexA}
              onChange={(e) => setIndexA(Number(e.target.value))}
              variant={variant}
            />
          </ToolField>
          <ToolField label="Índice B">
            <ToolInput
              type="number"
              min={0}
              value={indexB}
              onChange={(e) => setIndexB(Number(e.target.value))}
              variant={variant}
            />
          </ToolField>
          <ToolField label="Crib (ASCII/UTF-8)">
            <ToolInput
              value={crib}
              onChange={(e) => setCrib(e.target.value)}
              variant={variant}
            />
          </ToolField>
        </div>

        <PrimaryButton
          loading={busy}
          disabled={busy}
          onClick={run}
          className="w-fit"
          variant={variant}
        >
          Executar análise
        </PrimaryButton>

        <AnimatedResult show={!!result}>
          {result && (
            <div className="grid gap-3">
              <div className="text-sm text-zinc-300">{result.hint}</div>
              <ToolField label="XOR (hex)">
                <ToolTextarea
                  readOnly
                  value={result.xorHex}
                  className="min-h-20 font-mono text-xs"
                  variant={variant}
                />
              </ToolField>
              <ToolField label="Crib (hex)">
                <ToolTextarea
                  readOnly
                  value={result.cribHex}
                  className="min-h-16 font-mono text-xs"
                  variant={variant}
                />
              </ToolField>
            </div>
          )}
        </AnimatedResult>

        <AnimatePresence>
          {error && <ErrorBanner message={error} />}
        </AnimatePresence>
      </ToolCard>
    </div>
  );
}
