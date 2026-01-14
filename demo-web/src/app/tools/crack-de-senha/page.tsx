'use client';

import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

import {
  AnimatedContent,
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
import { tools } from '@/lib/tools';

type CrackResponse = {
  mode: 'numeric' | 'alpha';
  tried: number;
  matches: Array<{ hash: string; password: string }>;
  note: string;
};

const TOOL = tools.find((t) => t.href === '/tools/crack-de-senha');

export default function CrackDeSenhaPage() {
  const [modeUi, setModeUi] = usePersistentToolMode();
  const [mode, setMode] = useState<'numeric' | 'alpha'>('numeric');
  const [maxAlphaLen, setMaxAlphaLen] = useState(4);
  const [numericMax, setNumericMax] = useState(250000);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrackResponse | null>(null);

  const variant = modeUi === 'normal' ? 'beginner' : 'debug';

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
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              {TOOL && <TOOL.icon className="text-amber-300" size={18} />}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Crack de Senhas
            </h1>
          </div>
          <ToolModeSwitch mode={modeUi} onChange={setModeUi} compact />
        </div>
        <AnimatedContent mode={modeUi}>
          <p className="mt-2 text-base leading-relaxed text-zinc-300">
            {modeUi === 'normal'
              ? 'Demonstra um ataque de força bruta: tentar várias senhas até encontrar uma que gere o mesmo hash.'
              : 'O backend usa a lista hardcoded de hashes do projeto. O demo aplica limites para manter o tempo de execução razoável.'}
          </p>

          {modeUi === 'normal' && TOOL && (
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
        mode={modeUi}
        steps={
          modeUi === 'normal'
            ? [
                'Você escolhe como a ferramenta vai “chutar” senhas (números ou letras).',
                'A ferramenta testa muitas possibilidades, uma por uma.',
                'Quando encontra uma senha que “bate”, ela mostra a senha encontrada.',
                'Quanto maiores os limites, mais lento (e mais caro) fica.',
              ]
            : [
                'Escolha um modo de geração de candidatos (numérico ou alfabético).',
                'Para cada candidato, calcule SHA-256 e compare com a lista hardcoded de hashes conhecidos.',
                'Se bater, o backend registra a senha encontrada.',
                'O demo aplica limites para manter o tempo de execução razoável.',
              ]
        }
        debugCode={`// Pseudocódigo\nfor guess in guesses:\n  hash = sha256(guess)\n  if hash in KNOWN_HASHES: matches.add(guess)`}
        debugExtras={
          <div className="grid gap-3">
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
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-zinc-400">
              Em produção, estimativas como essa ajudam a prever tempo de
              execução e custos computacionais.
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
            variant={variant}
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
            variant={variant}
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
              variant={variant}
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
              variant={variant}
            />
          </ToolField>
        )}

        <PrimaryButton
          loading={busy}
          disabled={busy}
          onClick={run}
          className="w-fit"
          variant={variant}
        >
          Executar quebra
        </PrimaryButton>

        <AnimatedResult show={!!result}>
          {result && (
            <div className="grid gap-3">
              <div className="text-sm text-zinc-300">{result.note}</div>
              <div className="text-sm text-zinc-200">
                {modeUi === 'debug' ? 'Tentativas (backend): ' : 'Tentativas: '}
                <span className="font-mono">{result.tried}</span>
              </div>
              <ToolField label="Resultados">
                <ToolTextarea
                  readOnly
                  value={
                    result.matches.length === 0
                      ? 'Nenhuma senha encontrada dentro dos limites.'
                      : result.matches
                          .map((m) => `${m.password}  <-  ${m.hash}`)
                          .join('\n')
                  }
                  className="min-h-20 font-mono text-xs resize-none"
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
