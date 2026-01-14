'use client';

import { useMemo, useState } from 'react';

import {
  ErrorBanner,
  HowItWorks,
  PrimaryButton,
  SecondaryButton,
  ToolCard,
  ToolField,
  ToolInput,
  ToolModeSwitch,
  usePersistentToolMode,
} from '@/components/tool-kit';
import { apiPost } from '@/lib/api';

type CrackResponse = {
  mode: 'numeric' | 'alpha';
  tried: number;
  matches: Array<{ hash: string; password: string }>;
  note: string;
};

export default function CrackDeSenhaPage() {
  const [modeUi, setModeUi] = usePersistentToolMode();
  const [mode, setMode] = useState<'numeric' | 'alpha'>('numeric');
  const [maxAlphaLen, setMaxAlphaLen] = useState(4);
  const [numericMax, setNumericMax] = useState(250000);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrackResponse | null>(null);

  const estimatedTries = useMemo(() => {
    if (mode === 'numeric') return Math.max(0, Math.floor(numericMax)) + 1;
    const maxLen = Math.max(1, Math.min(5, Math.floor(maxAlphaLen)));
    let total = 0;
    for (let len = 1; len <= maxLen; len++) total += Math.pow(26, len);
    return total;
  }, [mode, numericMax, maxAlphaLen]);

  async function run() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await apiPost<CrackResponse>('/crack-de-senha/run', {
        mode,
        maxAlphaLen,
        numericMax,
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
            Crack de Senhas (hardcoded)
          </h1>
          <ToolModeSwitch mode={modeUi} onChange={setModeUi} />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          O backend usa a lista hardcoded de hashes do projeto. Para rodar em
          ambiente serverless, apliquei limites.
        </p>
      </div>

      <HowItWorks
        mode={modeUi}
        steps={[
          'Escolha um modo de geração de candidatos (numérico ou alfabético).',
          'Para cada candidato, calcule SHA-256 e compare com a lista hardcoded de hashes conhecidos.',
          'Se bater, o backend registra a senha encontrada.',
          'O demo aplica limites para manter o tempo de execução razoável.',
        ]}
        debugCode={`// Pseudocódigo\nfor guess in guesses:\n  hash = sha256(guess)\n  if hash in KNOWN_HASHES: matches.add(guess)`}
        debugExtras={
          <div className="grid gap-2 text-sm">
            <div className="text-zinc-200">
              Estimativa de tentativas (client)
            </div>
            <div className="font-mono text-xs text-zinc-300">
              {estimatedTries.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-zinc-400">
              {mode === 'numeric'
                ? 'N+1 tentativas (inclui 0).'
                : 'Soma de 26^len para len=1..max.'}
            </div>
          </div>
        }
      />

      <ToolCard loading={busy}>
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton
            type="button"
            onClick={() => setMode('numeric')}
            className={
              mode === 'numeric'
                ? ''
                : 'bg-white/10 text-zinc-100 hover:bg-white/15'
            }
          >
            Numérico
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={() => setMode('alpha')}
            className={
              mode === 'alpha'
                ? 'border-amber-500/40 bg-amber-500/10'
                : undefined
            }
          >
            Alfabético
          </SecondaryButton>
        </div>

        {mode === 'numeric' ? (
          <ToolField label="Máximo (0..N)">
            <ToolInput
              type="number"
              min={0}
              value={numericMax}
              onChange={(e) => setNumericMax(Number(e.target.value))}
            />
          </ToolField>
        ) : (
          <ToolField label="Tamanho máximo (a..z)">
            <ToolInput
              type="number"
              min={1}
              max={5}
              value={maxAlphaLen}
              onChange={(e) => setMaxAlphaLen(Number(e.target.value))}
            />
          </ToolField>
        )}

        <PrimaryButton
          loading={busy}
          disabled={busy}
          onClick={run}
          className="w-fit"
        >
          Executar (backend)
        </PrimaryButton>

        {result && (
          <div className="grid gap-3">
            <div className="text-sm text-zinc-300">{result.note}</div>
            <div className="text-sm text-zinc-200">
              Tentativas (backend):{' '}
              <span className="font-mono">{result.tried}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              {result.matches.length === 0 ? (
                <div className="text-sm text-zinc-300">
                  Nenhuma senha encontrada dentro dos limites.
                </div>
              ) : (
                <div className="grid gap-2">
                  {result.matches.map((m) => (
                    <div key={m.hash} className="flex flex-col gap-1">
                      <div className="font-mono text-xs text-zinc-400">
                        {m.hash}
                      </div>
                      <div className="text-sm font-semibold text-zinc-100">
                        {m.password}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {error && <ErrorBanner message={error} />}
      </ToolCard>
    </div>
  );
}
