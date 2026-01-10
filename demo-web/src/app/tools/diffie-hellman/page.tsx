"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type DhPublicResponse = { publicKey: string };
type DhSharedResponse = { sharedKey: string };

export default function DiffieHellmanPage() {
  const [privateKey, setPrivateKey] = useState("123456");
  const [publicKey, setPublicKey] = useState("");
  const [otherPublicKey, setOtherPublicKey] = useState("");
  const [sharedKey, setSharedKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function calcPublic() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<DhPublicResponse>("/diffie-hellman/public", { privateKey });
      setPublicKey(out.publicKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  async function calcShared() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<DhSharedResponse>("/diffie-hellman/shared", { privateKey, otherPublicKey });
      setSharedKey(out.sharedKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Diffie–Hellman</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Calcule sua chave pública e depois a chave compartilhada usando a pública da outra parte.
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Chave privada (inteiro)</span>
          <input
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={calcPublic}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
          >
            Calcular pública
          </button>
          <button
            disabled={busy || otherPublicKey.trim().length === 0}
            onClick={calcShared}
            className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
          >
            Calcular compartilhada
          </button>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Sua pública</span>
          <textarea
            value={publicKey}
            readOnly
            className="min-h-20 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none dark:border-white/10"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Pública da outra parte</span>
          <textarea
            value={otherPublicKey}
            onChange={(e) => setOtherPublicKey(e.target.value)}
            className="min-h-20 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Chave compartilhada</span>
          <textarea
            value={sharedKey}
            readOnly
            className="min-h-20 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none dark:border-white/10"
          />
        </label>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
