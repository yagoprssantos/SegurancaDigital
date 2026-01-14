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
import { tools } from '@/lib/tools';

type DhPublicResponse = { publicKey: string };
type DhSharedResponse = { sharedKey: string };

const TOOL = tools.find((t) => t.href === '/tools/diffie-hellman');

const DH_P = BigInt('102031405123416071809152453627382938465749676859789');
const DH_G = BigInt('1234567890123456789012345');

function powMod(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    e >>= 1n;
    b = (b * b) % mod;
  }
  return result;
}

export default function DiffieHellmanPage() {
  const [mode, setMode] = usePersistentToolMode();
  const [privateKey, setPrivateKey] = useState('123456');
  const [publicKey, setPublicKey] = useState('');
  const [otherPublicKey, setOtherPublicKey] = useState('');
  const [sharedKey, setSharedKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = mode === 'normal' ? 'beginner' : 'debug';

  const privBig = useMemo(() => {
    try {
      const s = (privateKey ?? '').trim();
      if (!s) return null;
      return BigInt(s);
    } catch {
      return null;
    }
  }, [privateKey]);

  const otherPubBig = useMemo(() => {
    try {
      const s = (otherPublicKey ?? '').trim();
      if (!s) return null;
      return BigInt(s);
    } catch {
      return null;
    }
  }, [otherPublicKey]);

  const clientPublic = useMemo(() => {
    if (mode !== 'debug') return null;
    if (privBig === null) return null;
    if (privBig < 0n) return null;
    return powMod(DH_G, privBig, DH_P).toString();
  }, [mode, privBig]);

  const clientShared = useMemo(() => {
    if (mode !== 'debug') return null;
    if (privBig === null || otherPubBig === null) return null;
    if (privBig < 0n) return null;
    return powMod(otherPubBig, privBig, DH_P).toString();
  }, [mode, privBig, otherPubBig]);

  async function calcPublic() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<DhPublicResponse>('/diffie-hellman/public', {
        privateKey,
      });
      setPublicKey(out.publicKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setBusy(false);
    }
  }

  async function calcShared() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<DhSharedResponse>('/diffie-hellman/shared', {
        privateKey,
        otherPublicKey,
      });
      setSharedKey(out.sharedKey);
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
              Diffie–Hellman
            </h1>
          </div>
          <ToolModeSwitch mode={mode} onChange={setMode} compact />
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-300">
          {mode === 'normal'
            ? 'Duas pessoas conseguem combinar um “segredo” pela internet sem enviar o segredo diretamente.'
            : 'Use uma chave privada para calcular sua chave pública e depois calcule a chave compartilhada.'}
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
                'Você escolhe um número secreto (sua “chave privada”).',
                'A ferramenta calcula um número público (sua “chave pública”).',
                'Você troca chaves públicas com outra pessoa.',
                'Com isso, cada lado calcula a mesma chave compartilhada.',
              ]
            : [
                'Escolha uma chave privada a (número grande).',
                'Calcule a chave pública: A = g^a mod p.',
                'Receba a chave pública do outro lado: B.',
                'Calcule a chave compartilhada: S = B^a mod p.',
                'O outro lado calcula S = A^b mod p e os dois chegam no mesmo S.',
              ]
        }
        debugCode={`// Modular exponentiation (fast)\nfunction powMod(base, exp, mod) {\n  result = 1\n  b = base % mod\n  while exp > 0:\n    if exp odd: result = (result*b) % mod\n    exp >>= 1\n    b = (b*b) % mod\n  return result\n}\n\npublic = powMod(g, a, p)\nshared = powMod(B, a, p)`}
        debugExtras={
          <div className="grid gap-3">
            <div className="text-xs text-zinc-400">
              Parâmetros do demo (do backend):
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-zinc-300">p = {DH_P.toString()}</div>
              <div className="text-xs text-zinc-300">g = {DH_G.toString()}</div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Prévia (browser)</div>
              <div className="text-xs text-zinc-400">
                {privBig === null
                  ? 'Chave privada inválida'
                  : privBig < 0n
                  ? 'Chave privada deve ser >= 0'
                  : 'Cálculo em tempo real habilitado'}
              </div>
              <div className="font-mono text-xs text-zinc-300">
                A = {clientPublic ?? '—'}
              </div>
              <div className="font-mono text-xs text-zinc-300">
                S = {clientShared ?? '—'}
              </div>
            </div>
          </div>
        }
      />

      <ToolCard loading={busy}>
        <ToolField label="Chave privada (inteiro)">
          <ToolInput
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            variant={variant}
          />
        </ToolField>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton
            loading={busy}
            disabled={busy}
            onClick={calcPublic}
            variant={variant}
          >
            Calcular chave pública
          </PrimaryButton>
          <SecondaryButton
            loading={busy}
            disabled={busy || otherPublicKey.trim().length === 0}
            onClick={calcShared}
            variant={variant}
          >
            Calcular chave compartilhada
          </SecondaryButton>
        </div>

        <AnimatedResult show={publicKey.trim().length > 0}>
          <ToolGrid>
            <ToolField label="Sua pública">
              <ToolTextarea
                value={publicKey}
                readOnly
                className="font-mono text-xs"
                variant={variant}
              />
            </ToolField>

            <ToolField label="Pública da outra parte">
              <ToolTextarea
                value={otherPublicKey}
                onChange={(e) => setOtherPublicKey(e.target.value)}
                className="font-mono text-xs"
                variant={variant}
              />
            </ToolField>
          </ToolGrid>
        </AnimatedResult>

        <AnimatedResult show={sharedKey.trim().length > 0}>
          <ToolField label="Chave compartilhada">
            <ToolTextarea
              value={sharedKey}
              readOnly
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
