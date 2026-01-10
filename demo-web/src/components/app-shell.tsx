import Link from "next/link";

import { tools } from "@/lib/tools";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-zinc-50/80 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Segurança Digital</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Demo interativa</div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              Início
            </Link>
            <Link
              href="/tools"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              Ferramentas
            </Link>
            <a
              href="https://github.com/yagoprssantos/SegurancaDigital"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              GitHub
            </a>
          </nav>

          <div className="md:hidden">
            <Link
              href="/tools"
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
            >
              Abrir
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-black/10 py-8 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            Backend: configure <span className="font-mono">NEXT_PUBLIC_API_BASE_URL</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {tools.slice(0, 4).map((t) => (
              <Link key={t.href} href={t.href} className="hover:text-zinc-950 dark:hover:text-white">
                {t.short}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
