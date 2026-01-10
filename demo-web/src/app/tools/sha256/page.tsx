"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type ShaResponse = { hashHex: string };

export default function Sha256Page() {
  const [text, setText] = useState("Olá mundo");
  const [hashHex, setHashHex] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<ShaResponse>("/sha256", { text });
      setHashHex(out.hashHex);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SHA-256</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Gera hash SHA-256 em hexadecimal.</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Texto</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-28 rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        <button
          disabled={busy}
          onClick={run}
          className="w-fit rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
        >
          Gerar hash
        </button>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Hash (hex)</span>
          <input
            readOnly
            value={hashHex}
            className="h-11 rounded-xl border border-black/10 bg-transparent px-3 font-mono text-xs outline-none dark:border-white/10"
          />
        </label>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
