'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FiHome, FiInfo, FiMenu, FiShield, FiTool, FiX } from 'react-icons/fi';
import { SiGithub } from 'react-icons/si';

import { Footer } from '@/components/footer';
import { tools } from '@/lib/tools';

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isToolsArea = pathname === '/tools' || pathname.startsWith('/tools/');
  const activeHref = useMemo(() => {
    const found = tools.find((t) => pathname === t.href);
    return found?.href;
  }, [pathname]);

  useEffect(() => {
    const found = tools.find((t) => t.href === pathname);
    if (!found) return;

    try {
      const key = 'sd-recent-tools';
      const raw = localStorage.getItem(key);
      const prev = raw ? (JSON.parse(raw) as unknown) : [];
      const prevArr = Array.isArray(prev)
        ? prev.filter((x) => typeof x === 'string')
        : [];
      const next = [
        found.href,
        ...prevArr.filter((h) => h !== found.href),
      ].slice(0, 8);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [pathname]);

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5">
              <FiShield className="text-amber-300" size={18} aria-hidden />
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
            <NavLink href="/sobre" active={pathname === '/sobre'}>
              <FiInfo className="inline mr-1" size={16} />
              Sobre
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full bg-amber-400 p-2 text-zinc-950 transition hover:bg-amber-300 flex items-center justify-center"
                aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileMenuOpen}
              >
                <motion.span
                  initial={false}
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </motion.span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="border-t border-white/10 bg-zinc-900/50 backdrop-blur md:hidden"
            >
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
                <Link
                  href="/sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
                >
                  <FiInfo size={18} />
                  Sobre
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <div
          className={isToolsArea ? 'grid gap-6 md:grid-cols-[260px_1fr]' : ''}
        >
          {isToolsArea && (
            <aside className="hidden md:block">
              <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-auto pr-1">
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
                            <div className="flex items-center gap-2">
                              <t.icon
                                size={16}
                                className={
                                  active ? 'text-amber-300' : 'text-zinc-300'
                                }
                                aria-hidden
                              />
                              <div className="text-sm font-medium text-zinc-100">
                                {t.short}
                              </div>
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

      <Footer />
    </div>
  );
}
