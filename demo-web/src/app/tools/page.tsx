import Link from "next/link";

import { tools } from "@/lib/tools";

export default function ToolsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ferramentas</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Selecione uma ferramenta para testar. Algumas usam dados hardcoded (como no projeto original).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950">
                {t.short}
              </div>
              <div className="text-sm font-semibold">{t.title}</div>
            </div>
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{t.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
