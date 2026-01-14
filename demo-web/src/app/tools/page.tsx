import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

import { tools } from '@/lib/tools';

export default function ToolsPage() {
  return (
    <div className="grid gap-6 sm:gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ferramentas
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">
          Selecione uma ferramenta para testar. Algumas usam dados hardcoded
          (como no projeto original).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-zinc-950">
                <t.icon size={18} aria-hidden />
              </div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <div>
                  <div className="text-base font-semibold">{t.title}</div>
                  <div className="mt-0.5 text-xs text-zinc-400">{t.short}</div>
                </div>
                <FiArrowRight
                  size={18}
                  className="text-zinc-400 group-hover:text-zinc-200 transition mt-0.5 flex-shrink-0"
                />
              </div>
            </div>
            <div className="mt-3 text-sm text-zinc-300">{t.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
