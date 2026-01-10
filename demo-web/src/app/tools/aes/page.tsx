"use client";

import { useMemo, useState } from "react";

import { apiPost } from "@/lib/api";

type AesEncryptResponse = { ciphertextBase64: string };
type AesDecryptResponse = { plaintext: string };

export default function AesPage() {
  const [key, setKey] = useState("1234567890abcdef");
  const [plaintext, setPlaintext] = useState("Teste AES");
  const [ciphertextBase64, setCiphertextBase64] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keyOk = useMemo(() => key.length === 16, [key]);

  async function encrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<AesEncryptResponse>("/aes/encrypt", { plaintext, key });
      setCiphertextBase64(out.ciphertextBase64);
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
      const out = await apiPost<AesDecryptResponse>("/aes/decrypt", { ciphertextBase64, key });
      setPlaintext(out.plaintext);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AES (CBC/PKCS5)</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Chave de 16 caracteres. Backend mantém o comportamento didático do projeto (ex.: IV fixo).
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Chave (16 chars)</span>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="h-11 rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
          {!keyOk && <span className="text-xs text-red-600">A chave precisa ter exatamente 16 caracteres.</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Texto (plaintext)</span>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            className="min-h-28 rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            disabled={!keyOk || busy}
            onClick={encrypt}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
          >
            Criptografar
          </button>
          <button
            disabled={!keyOk || busy || ciphertextBase64.trim().length === 0}
            onClick={decrypt}
            className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
          >
            Decriptografar
          </button>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Ciphertext (Base64)</span>
          <textarea
            value={ciphertextBase64}
            onChange={(e) => setCiphertextBase64(e.target.value)}
            className="min-h-28 rounded-xl border border-black/10 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />
        </label>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">{error}</div>}
      </div>
    </div>
  );
}
