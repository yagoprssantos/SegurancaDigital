import Link from 'next/link';
import { FiGithub, FiZap } from 'react-icons/fi';

import HomeClient from './home-client';

export default function Home() {
  return (
    <div className="grid gap-12 sm:gap-16">
      {/* Hero Section */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 sm:p-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-300">
            <FiZap size={14} />
            Demo Interativa
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Segurança Digital
          </h1>
          <p className="mt-4 text-xl leading-8 text-zinc-300 sm:text-2xl">
            Laboratório interativo de criptografia e ataques clássicos
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Entre direto nas ferramentas e aprenda testando. A Home é só o ponto
            de partida — explicações completas ficam em cada ferramenta e na aba
            Sobre.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tools"
              className="flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-center text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 hover:shadow-amber-400/30"
            >
              <FiZap size={18} />
              Começar agora
            </Link>
            <Link
              href="/sobre"
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-center text-sm font-medium text-zinc-100 transition hover:bg-white/10"
            >
              Entender o projeto
            </Link>
            <a
              href="https://github.com/yagoprssantos/SegurancaDigital"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-center text-sm font-medium text-zinc-100 transition hover:bg-white/10"
            >
              <FiGithub size={18} />
              Ver repositório
            </a>
          </div>
        </div>
      </section>

      <HomeClient />
    </div>
  );
}
