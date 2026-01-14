'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiExternalLink,
  FiHelpCircle,
  FiHome,
  FiInfo,
  FiTool,
} from 'react-icons/fi';

import pkg from '../../package.json';

import { apiBaseUrl } from '@/lib/api';
import { tools } from '@/lib/tools';

const AUTHOR_NAME = 'Yago';
const GITHUB_PROFILE_URL = 'https://github.com/yagoprssantos';
const GITHUB_REPO_URL = 'https://github.com/yagoprssantos/SegurancaDigital';

function FooterSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-semibold tracking-tight text-zinc-100">
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const classes =
    className ??
    'inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-50 transition';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
        <FiExternalLink aria-hidden className="opacity-70" size={14} />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

function BackendStatusBadge() {
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
    const interval = window.setInterval(check, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [base]);

  const dotClass =
    status === 'ok'
      ? 'bg-emerald-400'
      : status === 'down'
      ? 'bg-red-400'
      : 'bg-zinc-500';

  const label =
    status === 'ok'
      ? 'Online'
      : status === 'down'
      ? 'Indisponível'
      : 'Verificando';

  return (
    <a
      href={`${base}/health`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
      title={`API: ${base}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span>Backend</span>
      <span className="text-zinc-400">•</span>
      <span className="text-zinc-300">{label}</span>
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  const version =
    process.env.NEXT_PUBLIC_APP_VERSION &&
    process.env.NEXT_PUBLIC_APP_VERSION.trim().length > 0
      ? process.env.NEXT_PUBLIC_APP_VERSION.trim()
      : pkg.version;

  const commit =
    process.env.NEXT_PUBLIC_GIT_SHA &&
    process.env.NEXT_PUBLIC_GIT_SHA.trim().length > 0
      ? process.env.NEXT_PUBLIC_GIT_SHA.trim().slice(0, 8)
      : null;

  const envLabel =
    process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento';

  const featuredTools = useMemo(() => tools.slice(0, 4), []);

  return (
    <footer className="border-t border-white/10 bg-zinc-950 w-full">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {/* Navegação */}
          <div className="grid gap-2 text-sm">
            <FooterSectionTitle>Navegação</FooterSectionTitle>
            <div className="grid gap-2">
              <FooterLink href="/">
                <FiHome size={16} aria-hidden />
                Início
              </FooterLink>
              <FooterLink href="/tools">
                <FiTool size={16} aria-hidden />
                Ferramentas
              </FooterLink>
              <FooterLink href="/sobre">
                <FiInfo size={16} aria-hidden />
                Sobre
              </FooterLink>
            </div>
          </div>

          {/* Ferramentas principais */}
          <div className="grid gap-2 text-sm">
            <FooterSectionTitle>Ferramentas destacadas</FooterSectionTitle>
            <div className="grid gap-2">
              {featuredTools.map((t) => (
                <FooterLink key={t.href} href={t.href}>
                  <t.icon size={16} aria-hidden />
                  {t.short}
                </FooterLink>
              ))}
              <FooterLink
                href="/tools"
                className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition pt-1"
              >
                Ver todas
                <FiArrowRight size={16} aria-hidden />
              </FooterLink>
            </div>
          </div>

          {/* Status & Suporte (sem versão) */}
          <div className="grid gap-2 text-sm">
            <FooterSectionTitle>Status & Suporte</FooterSectionTitle>
            <div className="grid gap-2 text-xs">
              <BackendStatusBadge />
              <FooterLink
                href={`${GITHUB_REPO_URL}/issues/new/choose`}
                external
                className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-50 transition pt-1"
              >
                <FiHelpCircle size={16} aria-hidden />
                Reportar bug
              </FooterLink>
            </div>
          </div>
        </div>

        {/* Rodapé com copyright e legais */}
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500 text-center sm:text-left">
            © {year} {AUTHOR_NAME} • Demo educacional
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2">
            <FooterLink
              href="/termos"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Termos
            </FooterLink>
            <FooterLink
              href="/privacidade"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Privacidade
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
