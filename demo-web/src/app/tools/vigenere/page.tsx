"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type VigenereEncryptResponse = { cipherHex: string };
type VigenereDecryptResponse = { message: string };

export default function VigenerePage() {
  const [password, setPassword] = useState("senha");
  const [message, setMessage] = useState("Mensagem de teste");
  const [cipherHex, setCipherHex] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function encrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<VigenereEncryptResponse>("/vigenere/encrypt", { message, password });
      setCipherHex(out.cipherHex);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  async function decrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<VigenereDecryptResponse>("/vigenere/decrypt", { cipherHex, password });
      setMessage(out.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Criptografia Vigenère (XOR)</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Cifra/decifra por XOR, com saída em hexadecimal.</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Senha</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Mensagem</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-28 rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={encrypt}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
          >
            Cifrar
          </button>
          <button
            disabled={busy || cipherHex.trim().length === 0}
            onClick={decrypt}
            className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
          >
            Decifrar
          </button>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Cipher (hex)</span>
          <textarea
            value={cipherHex}
            onChange={(e) => setCipherHex(e.target.value)}
            className="min-h-28 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
