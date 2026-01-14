import Link from 'next/link';
import { FiArrowRight, FiShield } from 'react-icons/fi';

export default function TermsPage() {
  return (
    <div className="grid gap-10 sm:gap-12">
      <section className="grid gap-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Termos de uso
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-400">
          Estes termos descrevem o uso desta demo educacional de Segurança
          Digital.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <FiShield size={20} aria-hidden />
            </div>
            <h2 className="text-lg font-semibold">Uso educacional</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            O objetivo é ensinar conceitos de criptografia e segurança com
            exemplos práticos. Use para aprendizado, testes controlados e
            demonstrações.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-500/10 text-red-300">
              <span className="text-lg font-bold">!</span>
            </div>
            <h2 className="text-lg font-semibold">Uso indevido</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            É proibido utilizar este projeto para atividades maliciosas,
            invasões, quebra de segurança não autorizada, engenharia social ou
            qualquer prática ilegal.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Isenção de garantias</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Esta aplicação é fornecida “como está”, sem garantias de qualquer
          tipo. Resultados podem variar e não substituem auditorias, bibliotecas
          de produção ou consultoria especializada.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Você é responsável por como utiliza o conteúdo e pelos dados que envia
          ao backend quando estiver rodando localmente.
        </p>
      </section>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-zinc-300">
        <span className="font-semibold text-amber-300">Dica:</span> veja também
        a{' '}
        <Link href="/privacidade" className="text-amber-300 hover:underline">
          política de privacidade
        </Link>
        .
        <span className="ml-2 inline-flex items-center gap-2 text-zinc-400">
          <FiArrowRight size={16} aria-hidden />
          Links no rodapé
        </span>
      </section>
    </div>
  );
}
