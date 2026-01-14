'use client';

import { useEffect, useState } from 'react';
import { FiAlertCircle, FiChevronDown, FiCode } from 'react-icons/fi';

export type ToolMode = 'normal' | 'debug';

const TOOL_MODE_STORAGE_KEY = 'sd_tool_mode';

export function usePersistentToolMode(defaultMode: ToolMode = 'normal') {
  const [mode, setMode] = useState<ToolMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    try {
      const raw = window.localStorage.getItem(TOOL_MODE_STORAGE_KEY);
      if (raw === 'normal' || raw === 'debug') return raw;
    } catch {
      // ignore
    }
    return defaultMode;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(TOOL_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return [mode, setMode] as const;
}

const fadeUp = {
  initial: { opacity: 0, y: 6, scale: 0.995 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: { opacity: 0, y: 6, transition: { duration: 0.22 } },
};

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`sd-spinner ${className ?? ''}`}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.12"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function ToolModeSwitch({
  mode,
  onChange,
}: {
  mode: ToolMode;
  onChange: (mode: ToolMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-xs sd-smooth">
      <button
        type="button"
        onClick={() => onChange('normal')}
        className={`rounded-full px-3 py-1.5 sd-fade ${
          mode === 'normal'
            ? 'bg-amber-400 text-zinc-950'
            : 'text-zinc-200 hover:bg-white/5'
        }`}
        aria-pressed={mode === 'normal'}
      >
        Normal
      </button>
      <button
        type="button"
        onClick={() => onChange('debug')}
        className={`rounded-full px-3 py-1.5 sd-fade ${
          mode === 'debug'
            ? 'bg-amber-400 text-zinc-950'
            : 'text-zinc-200 hover:bg-white/5'
        }`}
        aria-pressed={mode === 'debug'}
      >
        Debug
      </button>
    </div>
  );
}

export function ToolCard({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="relative grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 sd-fade">
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/40">
          <div className="flex items-center gap-3">
            <LoadingSpinner className="text-amber-300" />
            <div className="text-sm text-zinc-100">Processando…</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ToolField({
  label,
  hint,
  debugInfo,
  children,
}: {
  label: string;
  hint?: string;
  debugInfo?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-zinc-100">{label}</span>
        {debugInfo && (
          <span className="text-xs font-mono text-zinc-400">{debugInfo}</span>
        )}
      </div>
      <div className="sd-fade w-full">{children}</div>
      {hint && <span className="text-xs text-zinc-400">{hint}</span>}
    </label>
  );
}

export function ToolInput(props: React.ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={`w-full h-12 sm:h-14 rounded-xl border border-white/10 bg-transparent px-4 text-base text-zinc-100 outline-none focus:ring-2 focus:ring-amber-400/60 sd-smooth ${
        props.className ?? ''
      }`}
    />
  );
}

export function ToolTextarea(props: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      {...props}
      className={`w-full min-h-32 sm:min-h-touch rounded-xl border border-white/10 bg-transparent px-4 py-3 text-base text-zinc-100 outline-none focus:ring-2 focus:ring-amber-400/60 sd-smooth ${
        props.className ?? ''
      }`}
    />
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function PrimaryButton({
  loading,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`w-full sm:w-auto rounded-full bg-amber-400 px-6 py-3 text-sm font-medium text-zinc-950 sd-smooth hover:bg-amber-300 disabled:opacity-50 flex items-center justify-center gap-2 ${
        className ?? ''
      }`}
      aria-busy={loading}
    >
      {loading && <LoadingSpinner className="text-amber-700" />}
      <span className={loading ? 'opacity-95' : ''}>{children}</span>
    </button>
  );
}

export function SecondaryButton({
  loading,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`w-full sm:w-auto rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-zinc-100 sd-smooth hover:bg-white/5 disabled:opacity-50 flex items-center justify-center gap-2 ${
        className ?? ''
      }`}
      aria-busy={loading}
    >
      {loading && <LoadingSpinner className="text-amber-300" />}
      <span>{children}</span>
    </button>
  );
}

export function Skeleton({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`grid gap-2 ${className ?? ''}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-lg bg-white/5 animate-pulse"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function ToolGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">{children}</div>;
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100 flex items-start gap-3 sd-fade">
      <FiAlertCircle size={18} className="flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="flex items-start gap-3 sd-fade">
      <FiCode size={18} className="flex-shrink-0 mt-2 text-amber-300" />
      <pre className="flex-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-zinc-200 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function HowItWorks({
  mode,
  steps,
  debugCode,
  debugExtras,
}: {
  mode: ToolMode;
  steps: string[];
  debugCode?: string;
  debugExtras?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-100 sd-smooth hover:bg-white/10 flex items-center gap-2"
        aria-expanded={open}
      >
        <span>Como funciona?</span>
        <FiChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 sd-fade">
          <div className="text-base font-semibold text-zinc-100">
            Passo a passo
          </div>
          <ol className="list-decimal space-y-2 pl-6 text-sm text-zinc-300">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          {mode === 'debug' && (
            <div className="grid gap-3">
              <div className="text-sm font-semibold text-zinc-100">Debug</div>
              <div className="text-sm text-zinc-300">
                Neste modo, a página mostra trechos de código e cálculos
                auxiliares em tempo real.
              </div>
              {debugCode && <CodeBlock code={debugCode} />}
              {debugExtras}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
