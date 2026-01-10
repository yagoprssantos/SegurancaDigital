"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type BreakOtpResponse = { xorHex: string; cribHex: string; hint: string };

export default function QuebraOtpPage() {
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(1);
  const [crib, setCrib] = useState(" the ");
  const [result, setResult] = useState<BreakOtpResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<BreakOtpResponse>("/quebra-otp/run", {
        indexA,
        indexB,
        crib,
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
        <h1 className="text-2xl font-semibold tracking-tight">Quebra OTP reutilizado (hardcoded)</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Selecione 2 criptogramas hardcoded e teste um berço (crib). O backend retorna XOR e o crib em hex.
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Índice A</span>
            <input
              type="number"
              min={0}
              value={indexA}
              onChange={(e) => setIndexA(Number(e.target.value))}
              className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Índice B</span>
            <input
              type="number"
              min={0}
              value={indexB}
              onChange={(e) => setIndexB(Number(e.target.value))}
              className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Crib (ASCII)</span>
            <input
              value={crib}
              onChange={(e) => setCrib(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
          </label>
        </div>

        <button
          disabled={busy}
          onClick={run}
          className="w-fit rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
        >
          Rodar XOR + crib
        </button>

        {result && (
          <div className="grid gap-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{result.hint}</div>
            <label className="grid gap-2">
              <span className="text-sm font-medium">XOR (hex)</span>
              <textarea
                readOnly
                value={result.xorHex}
                className="min-h-24 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none dark:border-white/10"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Crib (hex)</span>
              <textarea
                readOnly
                value={result.cribHex}
                className="min-h-16 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none dark:border-white/10"
              />
            </label>
          </div>
        )}

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
