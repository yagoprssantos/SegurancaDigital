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
  ToolGrid,
  ToolInput,
  ToolModeSwitch,
  ToolTextarea,
  usePersistentToolMode,
} from '@/components/tool-kit';
import { apiPost } from '@/lib/api';
import { base64ToBytes, toHex, utf8ToBytes } from '@/lib/bytes';
import { tools } from '@/lib/tools';

type AesEncryptResponse = { ciphertextBase64: string };
type AesDecryptResponse = { plaintext: string };

const TOOL = tools.find((t) => t.href === '/tools/aes');

export default function AesPage() {
  const [mode, setMode] = usePersistentToolMode();
  const [key, setKey] = useState('1234567890abcdef');
  const [plaintext, setPlaintext] = useState('Teste AES');
  const [ciphertextBase64, setCiphertextBase64] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = mode === 'normal' ? 'beginner' : 'debug';

  const keyOk = useMemo(() => key.length === 16, [key]);
  const ivBytes = useMemo(() => utf8ToBytes('Junior e Bonitao'), []);
  const plaintextBytes = useMemo(
    () => utf8ToBytes(plaintext ?? ''),
    [plaintext]
  );
  const keyBytes = useMemo(() => utf8ToBytes(key ?? ''), [key]);
  const ciphertextBytes = useMemo(() => {
    try {
      return base64ToBytes(ciphertextBase64);
    } catch {
      return null;
    }
  }, [ciphertextBase64]);

  async function encrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<AesEncryptResponse>('/aes/encrypt', {
        plaintext,
        key,
      });
      setCiphertextBase64(out.ciphertextBase64);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setBusy(false);
    }
  }

  async function decrypt() {
    setBusy(true);
    setError(null);
    try {
      const out = await apiPost<AesDecryptResponse>('/aes/decrypt', {
        ciphertextBase64,
        key,
      });
      setPlaintext(out.plaintext);
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
              AES (CBC/PKCS5)
            </h1>
          </div>
          <ToolModeSwitch mode={mode} onChange={setMode} compact />
        </div>
        <AnimatedContent mode={mode}>
          <p className="mt-2 text-base leading-relaxed text-zinc-300">
            {mode === 'normal'
              ? 'Criptografia simétrica: a mesma chave serve para criptografar e decriptografar.'
              : 'Chave de 16 caracteres. Backend mantém o comportamento didático do projeto (ex.: IV fixo).'}
          </p>

          {mode === 'normal' && TOOL && (
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
        mode={mode}
        steps={
          mode === 'normal'
            ? [
                'A chave é a “senha” do AES: sem ela, não dá para recuperar o texto.',
                'Ao criptografar, o resultado vira um ciphertext (texto cifrado).',
                'O ciphertext aparece em Base64 porque é um formato fácil de copiar e colar.',
                'Ao decriptografar, o AES usa a mesma chave para voltar ao texto original.',
              ]
            : [
                'Valide se a chave tem exatamente 16 caracteres (AES-128).',
                'Converta plaintext e chave para bytes (UTF-8).',
                'Use AES no modo CBC com IV fixo (didático; não é recomendado em produção).',
                'Aplique padding PKCS5/PKCS7 para múltiplos de 16 bytes.',
                'Criptografe bloco a bloco e codifique o resultado em Base64.',
                'Para decriptografar: decodifique Base64 → bytes → AES-CBC decrypt → remova padding.',
              ]
        }
        debugCode={`// Backend (Java) – ideia geral\nCipher cipher = Cipher.getInstance(\"AES/CBC/PKCS5Padding\");\nSecretKey key = new SecretKeySpec(keyBytes, \"AES\");\nIvParameterSpec iv = new IvParameterSpec(\"Junior e Bonitao\".getBytes(UTF_8));\n\ncipher.init(ENCRYPT_MODE, key, iv);\nbyte[] ciphertext = cipher.doFinal(plaintextBytes);\nString b64 = Base64.getEncoder().encodeToString(ciphertext);`}
        debugExtras={
          <div className="grid gap-3">
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">IV (fixo no backend)</div>
              <div className="font-mono text-xs text-zinc-300">
                {toHex(ivBytes)} ({ivBytes.length} bytes)
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Chave (bytes)</div>
              <div className="font-mono text-xs text-zinc-300">
                {toHex(keyBytes)} ({keyBytes.length} bytes)
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Plaintext (UTF-8 → hex)</div>
              <div className="font-mono text-xs text-zinc-300">
                {toHex(plaintextBytes)} ({plaintextBytes.length} bytes)
              </div>
            </div>
            <div className="grid gap-1 text-sm">
              <div className="text-zinc-200">Ciphertext (Base64 → bytes)</div>
              <div className="text-xs text-zinc-400">
                {ciphertextBase64.trim().length === 0
                  ? '(vazio)'
                  : ciphertextBytes
                  ? `${ciphertextBytes.length} bytes (ok)`
                  : 'Base64 inválido'}
              </div>
            </div>
          </div>
        }
      />

      <ToolCard loading={busy}>
        <ToolGrid>
          <ToolField
            label="Chave (16 chars)"
            debugInfo={
              mode === 'debug' && keyOk ? `${keyBytes.length} bytes` : undefined
            }
            hint={
              !keyOk
                ? 'A chave precisa ter exatamente 16 caracteres.'
                : undefined
            }
          >
            <ToolInput
              value={key}
              onChange={(e) => setKey(e.target.value)}
              variant={variant}
            />
          </ToolField>

          <ToolField
            label="Texto (plaintext)"
            debugInfo={
              mode === 'debug' ? `${plaintextBytes.length} bytes` : undefined
            }
          >
            <ToolTextarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              className="min-h-20"
              variant={variant}
            />
          </ToolField>
        </ToolGrid>

        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton
            loading={busy}
            disabled={!keyOk || busy}
            onClick={encrypt}
            variant={variant}
          >
            Criptografar
          </PrimaryButton>
          <SecondaryButton
            loading={busy}
            disabled={!keyOk || busy || ciphertextBase64.trim().length === 0}
            onClick={decrypt}
            variant={variant}
          >
            Decriptografar
          </SecondaryButton>
        </div>

        <AnimatedResult show={ciphertextBase64.trim().length > 0}>
          <ToolField
            label="Ciphertext (Base64)"
            debugInfo={
              mode === 'debug' && ciphertextBytes
                ? `${ciphertextBytes.length} bytes`
                : undefined
            }
          >
            <ToolTextarea
              value={ciphertextBase64}
              onChange={(e) => setCiphertextBase64(e.target.value)}
              className="font-mono text-xs min-h-20"
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
