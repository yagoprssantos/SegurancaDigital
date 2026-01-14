import Link from 'next/link';
import { FiGithub, FiZap } from 'react-icons/fi';

import { tools } from '@/lib/tools';

export default function Home() {
  return (
    <div className="grid gap-10 sm:gap-12">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Segurança Digital — Demo interativa
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-300">
            Uma interface web para testar, visualizar e demonstrar os algoritmos
            do repositório sem precisar abrir o código. O backend é Java
            (stateless) e os exemplos de algumas ferramentas permanecem
            hardcoded, como no projeto original.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tools"
              className="flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
            >
              <FiZap size={18} />
              Abrir ferramentas
            </Link>
            <a
              href="https://github.com/yagoprssantos/SegurancaDigital"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-center text-sm font-medium text-zinc-100 transition hover:bg-white/10"
            >
              <FiGithub size={18} />
              Ver repositório
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Destaques</h2>
          <Link
            href="/tools"
            className="text-sm font-medium text-amber-300 hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 4).map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">{t.title}</div>
                <div className="text-xs text-zinc-400 group-hover:text-zinc-200">
                  Abrir →
                </div>
              </div>
              <div className="mt-3 text-sm text-zinc-300">{t.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
