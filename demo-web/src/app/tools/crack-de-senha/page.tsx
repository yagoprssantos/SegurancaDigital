"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type CrackResponse = {
  mode: "numeric" | "alpha";
  tried: number;
  matches: Array<{ hash: string; password: string }>;
  note: string;
};

export default function CrackDeSenhaPage() {
  const [mode, setMode] = useState<"numeric" | "alpha">("numeric");
  const [maxAlphaLen, setMaxAlphaLen] = useState(4);
  const [numericMax, setNumericMax] = useState(250000);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrackResponse | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await apiPost<CrackResponse>("/crack-de-senha/run", {
        mode,
        maxAlphaLen,
        numericMax,
      });
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
        <h1 className="text-2xl font-semibold tracking-tight">Crack de Senhas (hardcoded)</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          O backend usa a lista hardcoded de hashes do projeto. Para rodar em ambiente serverless, apliquei limites.
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setMode("numeric")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === "numeric"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                : "border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            }`}
          >
            Numérico
          </button>
          <button
            onClick={() => setMode("alpha")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === "alpha"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                : "border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            }`}
          >
            Alfabético
          </button>
        </div>

        {mode === "numeric" ? (
          <label className="grid gap-2">
            <span className="text-sm font-medium">Máximo (0..N)</span>
            <input
              type="number"
              min={0}
              value={numericMax}
              onChange={(e) => setNumericMax(Number(e.target.value))}
              className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
          </label>
        ) : (
          <label className="grid gap-2">
            <span className="text-sm font-medium">Tamanho máximo (a..z)</span>
            <input
              type="number"
              min={1}
              max={5}
              value={maxAlphaLen}
              onChange={(e) => setMaxAlphaLen(Number(e.target.value))}
              className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
          </label>
        )}

        <button
          disabled={busy}
          onClick={run}
          className="w-fit rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
        >
          Executar
        </button>

        {result && (
          <div className="grid gap-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{result.note}</div>
            <div className="text-sm">
              Tentativas: <span className="font-mono">{result.tried}</span>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/10">
              {result.matches.length === 0 ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-300">Nenhuma senha encontrada dentro dos limites.</div>
              ) : (
                <div className="grid gap-2">
                  {result.matches.map((m) => (
                    <div key={m.hash} className="flex flex-col gap-1">
                      <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300">{m.hash}</div>
                      <div className="text-sm font-semibold">{m.password}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
