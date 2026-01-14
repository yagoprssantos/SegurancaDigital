'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiChevronDown, FiCode } from 'react-icons/fi';

export type ToolMode = 'normal' | 'debug';

const TOOL_MODE_STORAGE_KEY = 'sd_tool_mode';

export function usePersistentToolMode(defaultMode: ToolMode = 'normal') {
  // Keep the initial value deterministic for SSR (avoid reading localStorage
  // during render). After the component mounts, read any persisted value and
  // update state. This prevents server/client markup mismatches during
  // hydration.
  const [mode, setMode] = useState<ToolMode>(defaultMode);

  useEffect(() => {
    let active = true;

    try {
      const raw = window.localStorage.getItem(TOOL_MODE_STORAGE_KEY);
      if (raw === 'normal' || raw === 'debug') {
        // Defer to avoid calling setState synchronously inside an effect.
        const next = raw;
        window.setTimeout(() => {
          if (active) setMode(next);
        }, 0);
      }
    } catch {
      // ignore
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(TOOL_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return [mode, setMode] as const;
}

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

export function AnimatedContent({
  mode,
  children,
}: {
  mode: ToolMode;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AnimatedResult({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToolModeSwitch(props: {
  mode: ToolMode;
  onChange: (mode: ToolMode) => void;
  compact?: boolean;
}) {
  const { mode, onChange, compact } = props;
  return (
    <div
      className={`relative rounded-full border border-white/10 bg-white/5 p-1 text-sm md:text-xs flex ${
        compact ? 'md:inline-flex md:w-auto' : 'w-full md:inline-flex'
      } items-center`}
      role="tablist"
    >
      <motion.div
        className="absolute rounded-full h-[calc(100%-8px)] top-1"
        initial={false}
        animate={{
          left: mode === 'normal' ? '4px' : 'calc(50% + 2px)',
          width: mode === 'normal' ? 'calc(50% - 6px)' : 'calc(50% - 6px)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div
          className={`h-full w-full rounded-full shadow-lg ${
            mode === 'normal'
              ? 'bg-green-500 shadow-green-500/20'
              : 'bg-blue-500 shadow-blue-500/20'
          }`}
        />
      </motion.div>
      <button
        type="button"
        onClick={() => onChange('normal')}
        className={`relative z-10 flex-1 ${
          compact
            ? 'md:flex-none px-3 py-1 text-sm'
            : 'px-4 py-2 md:px-3 md:py-1.5 text-sm'
        } text-center rounded-full transition-colors duration-200 ${
          mode === 'normal' ? 'text-white' : 'text-zinc-200 hover:text-white'
        }`}
        aria-selected={mode === 'normal'}
        role="tab"
      >
        Iniciante
      </button>
      <button
        type="button"
        onClick={() => onChange('debug')}
        className={`relative z-10 flex-1 ${
          compact
            ? 'md:flex-none px-3 py-1 text-sm'
            : 'px-4 py-2 md:px-3 md:py-1.5 text-sm'
        } text-center rounded-full transition-colors duration-200 ${
          mode === 'debug' ? 'text-white' : 'text-zinc-200 hover:text-white'
        }`}
        role="tab"
        aria-selected={mode === 'debug'}
      >
        Debug
      </button>
    </div>
  );
}

export function ToolCard({
  children,
  loading,
  className,
}: {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 sd-fade ${
        className ?? ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
      {loading && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-3">
            <LoadingSpinner className="text-amber-300" />
            <div className="text-sm text-zinc-100">Processando…</div>
          </div>
        </motion.div>
      )}
    </motion.div>
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

export function ToolInput(
  props: React.ComponentProps<'input'> & {
    variant?: 'default' | 'beginner' | 'debug';
  }
) {
  const { variant = 'default', ...inputProps } = props;
  const ringClasses = {
    default: 'focus:ring-amber-400/60',
    beginner: 'focus:ring-green-500/60',
    debug: 'focus:ring-blue-500/60',
  };

  return (
    <input
      {...inputProps}
      className={`w-full h-12 rounded-xl border border-white/10 bg-transparent px-3 text-sm text-zinc-100 outline-none focus:ring-2 transition-all sd-smooth ${
        ringClasses[variant]
      } ${props.className ?? ''}`}
    />
  );
}

export function ToolTextarea(
  props: React.ComponentProps<'textarea'> & {
    variant?: 'default' | 'beginner' | 'debug';
  }
) {
  const { variant = 'default', ...textareaProps } = props;
  const ringClasses = {
    default: 'focus:ring-amber-400/60',
    beginner: 'focus:ring-green-500/60',
    debug: 'focus:ring-blue-500/60',
  };

  return (
    <textarea
      {...textareaProps}
      className={`w-full min-h-12 rounded-xl border border-white/10 bg-transparent px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 resize-y transition-all sd-smooth ${
        ringClasses[variant]
      } ${props.className ?? ''}`}
    />
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'default' | 'beginner' | 'debug';
};

export function PrimaryButton({
  loading,
  children,
  className,
  variant = 'default',
  onClick,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const variantClasses = {
    default:
      'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-lg shadow-amber-400/20',
    beginner:
      'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20',
    debug:
      'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20',
  };

  const spinnerClasses = {
    default: 'text-amber-700',
    beginner: 'text-green-200',
    debug: 'text-blue-200',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full sm:w-auto rounded-full px-6 py-3 text-sm font-medium sd-smooth disabled:opacity-50 flex items-center justify-center gap-2 ${
        variantClasses[variant]
      } ${className ?? ''}`}
      aria-busy={loading}
      whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {loading && <LoadingSpinner className={spinnerClasses[variant]} />}
      <span className={loading ? 'opacity-95' : ''}>{children}</span>
    </motion.button>
  );
}

export function SecondaryButton({
  loading,
  children,
  className,
  variant = 'default',
  onClick,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const borderClasses = {
    default: 'border-white/10 hover:bg-white/5',
    beginner: 'border-green-500/30 hover:bg-green-500/10',
    debug: 'border-blue-500/30 hover:bg-blue-500/10',
  };

  const spinnerClasses = {
    default: 'text-amber-300',
    beginner: 'text-green-300',
    debug: 'text-blue-300',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full sm:w-auto rounded-full border px-6 py-3 text-sm font-medium text-zinc-100 sd-smooth disabled:opacity-50 flex items-center justify-center gap-2 ${
        borderClasses[variant]
      } ${className ?? ''}`}
      aria-busy={loading}
      whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {loading && <LoadingSpinner className={spinnerClasses[variant]} />}
      <span>{children}</span>
    </motion.button>
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
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100 flex items-start gap-3"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FiAlertCircle size={18} className="flex-shrink-0 mt-0.5" />
      </motion.div>
      <span>{message}</span>
    </motion.div>
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
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-100 sd-smooth hover:bg-white/10 flex items-center gap-2"
        aria-expanded={open}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span>Como funciona?</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <FiChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{
              opacity: { duration: 0.2 },
              height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="text-base font-semibold text-zinc-100">
                Passo a passo
              </div>
              <ol className="list-decimal space-y-2 pl-6 text-sm text-zinc-300">
                {steps.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    {s}
                  </motion.li>
                ))}
              </ol>

              {mode === 'debug' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: steps.length * 0.05, duration: 0.3 }}
                  className="grid gap-3"
                >
                  <div className="text-sm font-semibold text-zinc-100">
                    Debug
                  </div>
                  <div className="text-sm text-zinc-300">
                    Neste modo, a página mostra trechos de código e cálculos
                    auxiliares em tempo real.
                  </div>
                  {debugCode && <CodeBlock code={debugCode} />}
                  {debugExtras}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
