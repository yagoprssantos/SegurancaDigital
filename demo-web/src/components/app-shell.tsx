'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiHome, FiMenu, FiTool, FiX } from 'react-icons/fi';
import { MdHealthAndSafety } from 'react-icons/md';
import { SiGithub } from 'react-icons/si';

import { apiBaseUrl } from '@/lib/api';
import { tools } from '@/lib/tools';

const AUTHOR_NAME = 'Yago';
const GITHUB_PROFILE_URL = 'https://github.com/yagoprssantos';
const GITHUB_REPO_URL = 'https://github.com/yagoprssantos/SegurancaDigital';

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? 'bg-amber-500/15 text-amber-200'
          : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-50'
      }`}
    >
      {children}
    </Link>
  );
}

function BackendStatus() {
  const [status, setStatus] = useState<'unknown' | 'ok' | 'down'>('unknown');
  const base = apiBaseUrl();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`${base}/health`, { cache: 'no-store' });
        if (!cancelled) setStatus(res.ok ? 'ok' : 'down');
      } catch {
        if (!cancelled) setStatus('down');
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [base]);

  const dotClass =
    status === 'ok'
      ? 'bg-emerald-400'
      : status === 'down'
      ? 'bg-red-400'
      : 'bg-zinc-500';

  return (
    <a
      href={`${base}/health`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
      title={`API: ${base}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span className="hidden sm:inline">Backend</span>
      <span className="font-mono text-zinc-300">
        {base.replace(/^https?:\/\//, '')}
      </span>
    </a>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isToolsArea = pathname === '/tools' || pathname.startsWith('/tools/');
  const activeHref = useMemo(() => {
    const found = tools.find((t) => pathname === t.href);
    return found?.href;
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                Segurança Digital
              </div>
              <div className="text-xs text-zinc-400">Demo interativa</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink href="/" active={pathname === '/'}>
              <FiHome className="inline mr-1" size={16} />
              Início
            </NavLink>
            <NavLink
              href="/tools"
              active={pathname === '/tools' || pathname.startsWith('/tools/')}
            >
              <FiTool className="inline mr-1" size={16} />
              Ferramentas
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-amber-300"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <FiX size={20} />
                ) : (
                  <div className="flex items-center gap-2">
                    <FiMenu size={20} />
                    <span>Abrir</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-zinc-900/50 backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
              >
                <FiHome size={18} />
                Início
              </Link>
              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
              >
                <FiTool size={18} />
                Ferramentas
              </Link>
              <a
                href="https://github.com/yagoprssantos/SegurancaDigital"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-300 transition hover:bg-white/5"
              >
                <SiGithub size={18} />
                Repositório
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div
          className={isToolsArea ? 'grid gap-6 md:grid-cols-[260px_1fr]' : ''}
        >
          {isToolsArea && (
            <aside className="hidden md:block">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="px-2 pb-2 text-xs font-semibold tracking-wide text-zinc-300">
                  Ferramentas
                </div>
                <div className="grid gap-1">
                  {tools.map((t) => {
                    const active = activeHref === t.href;
                    return (
                      <Link
                        key={t.href}
                        href={t.href}
                        className={`group rounded-2xl px-3 py-2 transition ${
                          active
                            ? 'border border-amber-500/25 bg-amber-500/10'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-zinc-100">
                            {t.short}
                          </div>
                          <div className="text-[11px] text-zinc-400 group-hover:text-zinc-300">
                            Abrir →
                          </div>
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-zinc-400">
                          {t.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          <main>
            <div key={pathname} className="sd-fade">
              {children}
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-sm text-zinc-400">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="grid gap-3">
            <div className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <SiGithub size={18} className="text-amber-300" />
              {AUTHOR_NAME}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:text-zinc-100 transition flex items-center gap-1.5"
              >
                <SiGithub size={14} />
                GitHub
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:text-zinc-100 transition flex items-center gap-1.5"
              >
                <FiArrowRight size={16} />
                Repositório
              </a>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <MdHealthAndSafety size={20} />
              Conexão
            </div>
            <div className="text-xs text-zinc-400">
              <span className="font-mono text-xs">{apiBaseUrl()}</span>
            </div>
            <BackendStatus />
          </div>

          <div className="grid gap-3 sm:col-span-2 md:col-span-1">
            <div className="text-base font-semibold text-zinc-200">Atalhos</div>
            <div className="flex flex-wrap gap-4">
              {tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="text-sm hover:text-zinc-100 transition"
                >
                  {t.short}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
