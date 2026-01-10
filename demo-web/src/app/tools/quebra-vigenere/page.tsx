"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type BreakVigenereResponse = { key: string; plaintextGuess: string; cipherHex: string };

export default function QuebraVigenerePage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BreakVigenereResponse | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<BreakVigenereResponse>("/quebra-vigenere/run", {});
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quebra Vigenère (hardcoded)</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Executa o ataque estatístico usando o criptograma hardcoded do backend (como no projeto original).
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <button
          disabled={busy}
          onClick={run}
          className="w-fit rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
        >
          Rodar quebra
        </button>

        {result && (
          <div className="grid gap-3">
            <div className="grid gap-1">
              <div className="text-sm font-medium">Chave estimada</div>
              <div className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-white/10">
                {result.key}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-medium">Plaintext (estimativa)</div>
              <div className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/10">
                {result.plaintextGuess}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-medium">Cipher (hex)</div>
              <div className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 font-mono text-xs dark:border-white/10 dark:bg-white/10">
                {result.cipherHex}
              </div>
            </div>
          </div>
        )}

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
