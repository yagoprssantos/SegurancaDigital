import Link from "next/link";

import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="grid gap-10">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Segurança Digital — Demo interativa
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Uma interface web para testar, visualizar e demonstrar os algoritmos do repositório
            sem precisar abrir o código. O backend é Java (stateless) e os exemplos de algumas
            ferramentas permanecem hardcoded, como no projeto original.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              Abrir ferramentas
            </Link>
            <a
              href="https://github.com/yagoprssantos/SegurancaDigital"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-white/10"
            >
              Ver repositório
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Destaques</h2>
          <Link href="/tools" className="text-sm text-indigo-600 hover:underline dark:text-indigo-300">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.slice(0, 4).map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="text-xs text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  Abrir →
                </div>
              </div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

