'use client';

import { useMemo, useState } from 'react';

import {
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

type BreakOtpResponse = { xorHex: string; cribHex: string; hint: string };

export default function QuebraOtpPage() {
  const [mode, setMode] = usePersistentToolMode();
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(1);
  const [crib, setCrib] = useState(' the ');
  const [result, setResult] = useState<BreakOtpResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <h1 className="text-3xl font-semibold tracking-tight">
            Quebra OTP reutilizado (hardcoded)
          </h1>
          <ToolModeSwitch mode={mode} onChange={setMode} />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          Selecione 2 criptogramas hardcoded e teste um berço (crib). O backend
          retorna XOR e o crib em hex.
        </p>
      </div>

      <HowItWorks
        mode={mode}
        steps={[
          'Pegue dois criptogramas C1 e C2 que foram cifrados com a mesma OTP (erro clássico).',
          'Compute XOR: X = C1 XOR C2 = P1 XOR P2 (o key stream cancela).',
          "Escolha um 'crib' (pedaço provável de texto) e alinhe em uma posição.",
          'Então você deriva um pedaço do outro plaintext: P2 = X XOR crib (ou P1, dependendo do alinhamento).',
          'Repita mudando crib/posições até encontrar texto legível.',
        ]}
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
            />
          </ToolField>
          <ToolField label="Índice B">
            <ToolInput
              type="number"
              min={0}
              value={indexB}
              onChange={(e) => setIndexB(Number(e.target.value))}
            />
          </ToolField>
          <ToolField label="Crib (ASCII/UTF-8)">
            <ToolInput value={crib} onChange={(e) => setCrib(e.target.value)} />
          </ToolField>
        </div>

        <PrimaryButton
          loading={busy}
          disabled={busy}
          onClick={run}
          className="w-fit"
        >
          Rodar XOR + crib (backend)
        </PrimaryButton>

        {result && (
          <div className="grid gap-3">
            <div className="text-sm text-zinc-300">{result.hint}</div>
            <ToolField label="XOR (hex)">
              <ToolTextarea
                readOnly
                value={result.xorHex}
                className="min-h-24 font-mono text-xs"
              />
            </ToolField>
            <ToolField label="Crib (hex)">
              <ToolTextarea
                readOnly
                value={result.cribHex}
                className="min-h-16 font-mono text-xs"
              />
            </ToolField>
          </div>
        )}

        {error && <ErrorBanner message={error} />}
      </ToolCard>
    </div>
  );
}
