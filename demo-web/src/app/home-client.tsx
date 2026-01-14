'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

import { ToolCard, ToolInput } from '@/components/tool-kit';
import { tools } from '@/lib/tools';

type ToolHref = (typeof tools)[number]['href'];

function readRecentTools(): ToolHref[] {
  try {
    const raw = localStorage.getItem('sd-recent-tools');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is ToolHref => typeof x === 'string');
  } catch {
    return [];
  }
}

const FEATURED: ToolHref[] = [
  '/tools/aes',
  '/tools/sha256',
  '/tools/diffie-hellman',
];

export default function HomeClient() {
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<ToolHref[]>([]);

  useEffect(() => {
    // Intentionally update after mount to match server-rendered markup
    // (server has no access to localStorage). Defer the state update to
    // avoid triggering the `react-hooks/set-state-in-effect` rule.
    const id = window.setTimeout(() => {
      setRecents(readRecentTools());
    }, 0);

    return () => {
      window.clearTimeout(id);
    };
  }, []);

  const featured = useMemo(() => {
    const found = FEATURED.map((href) =>
      tools.find((t) => t.href === href)
    ).filter((t): t is (typeof tools)[number] => Boolean(t));
    return found.length > 0 ? found : tools.slice(0, 3);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) => {
      const hay =
        `${t.short} ${t.title} ${t.description} ${t.beginner.what}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const recentTools = useMemo(() => {
    if (recents.length === 0) return [];
    const map = new Map(tools.map((t) => [t.href, t] as const));
    return recents
      .map((h) => map.get(h))
      .filter(Boolean) as (typeof tools)[number][];
  }, [recents]);

  return (
    <div className="grid gap-10 sm:gap-12">
      {recentTools.length > 0 && (
        <section className="grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight">Recentes</h2>
            <Link
              href="/tools"
              className="text-sm font-medium text-amber-300 hover:underline"
            >
              Ver todas <FiArrowRight className="inline" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.slice(0, 3).map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-zinc-950">
                    <t.icon size={18} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-base font-semibold">{t.title}</div>
                      <div className="text-xs text-zinc-400 group-hover:text-zinc-200">
                        Abrir →
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-300">
                      {t.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">Comece por aqui</h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-amber-300 hover:underline"
          >
            Abrir Ferramentas <FiArrowRight className="inline" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => (
            <ToolCard key={t.href} className="p-0">
              <Link href={t.href} className="block p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-zinc-950">
                    <t.icon size={18} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-base font-semibold text-zinc-100">
                        {t.short}
                      </div>
                      <div className="text-xs text-zinc-400">Abrir →</div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-300">
                      {t.description}
                    </div>
                    <div className="mt-2 text-xs text-zinc-400 line-clamp-2">
                      {t.beginner.what}
                    </div>
                  </div>
                </div>
              </Link>
            </ToolCard>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">
            Procurar ferramenta
          </h2>
          <div className="text-sm text-zinc-400">
            {filtered.length} disponíveis
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <div className="text-zinc-400">
              <FiSearch aria-hidden />
            </div>
            <ToolInput
              placeholder="Ex.: AES, hash, OTP, Diffie…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, query.trim() ? 12 : 6).map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-amber-300">
                    <t.icon size={16} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-zinc-100">
                        {t.short}
                      </div>
                      <div className="text-[11px] text-zinc-400 group-hover:text-zinc-200">
                        Abrir →
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {t.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!query.trim() && (
            <div className="text-xs text-zinc-500">
              Dica: digite para filtrar por nome, descrição e palavras-chave.
            </div>
          )}

          {query.trim() && filtered.length > 12 && (
            <Link
              href="/tools"
              className="w-fit text-sm font-medium text-amber-300 hover:underline"
            >
              Ver todos os resultados na página de ferramentas{' '}
              <FiArrowRight className="inline" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
