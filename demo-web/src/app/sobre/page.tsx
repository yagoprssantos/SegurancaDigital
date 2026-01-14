import { FiBook, FiCode, FiGithub, FiZap } from 'react-icons/fi';
import { SiDocker, SiNextdotjs, SiOpenjdk, SiSpring } from 'react-icons/si';

export default function AboutPage() {
  return (
    <div className="grid gap-12 sm:gap-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Sobre o projeto
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
          Conheça a história, motivação e propósito por trás deste laboratório
          interativo de Segurança Digital.
        </p>
      </section>

      {/* About Cards */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <FiBook size={20} />
            </div>
            <h2 className="text-lg font-semibold">O que é?</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Este site é a versão web dos meus projetos didáticos de Segurança
            Digital. Originalmente desenvolvidos como códigos-fonte educativos,
            agora estão disponíveis em uma interface interativa que permite
            testar e compreender os algoritmos sem configurar ambiente local.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <FiZap size={20} />
            </div>
            <h2 className="text-lg font-semibold">Motivação</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Tornar conceitos de criptografia mais acessíveis e práticos. Muitos
            estudantes têm dificuldade em visualizar como algoritmos funcionam
            na prática. Este demo elimina barreiras: basta acessar, inserir
            dados e ver os resultados.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <FiCode size={20} />
            </div>
            <h2 className="text-lg font-semibold">Para que serve?</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            O repositório contém os códigos-fonte originais (Java) e a aplicação
            web moderna (Next.js + Spring Boot). Serve como material de estudo,
            demonstração de boas práticas e referência para quem quer aprender
            ou ensinar criptografia.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <FiGithub size={20} />
            </div>
            <h2 className="text-lg font-semibold">Repositório</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Totalmente open source. Você pode clonar, rodar localmente com
            Docker, estudar o código e até contribuir. Ideal para estudantes de
            segurança da informação, desenvolvedores e educadores que buscam
            material prático e didático.
          </p>
        </div>
      </section>

      {/* Mode Comparison */}
      <section className="grid gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Dois modos de uso
          </h2>
          <p className="mt-2 text-base text-zinc-400">
            Alterne entre os modos conforme seu nível de conhecimento e
            necessidade.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-300">
                Iniciante
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              Para quem está começando
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Interface limpa e explicações em linguagem simples. Você vê o que
              cada ferramenta faz, por que é importante e como usar, sem jargões
              técnicos ou detalhes complexos.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Textos explicativos acessíveis</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Foco no &quot;o que&quot; e &quot;por quê&quot;</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Interface simplificada</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Ideal para aprender conceitos</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                Debug
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              Para desenvolvedores e curiosos
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Revela detalhes técnicos, validações no navegador, pseudocódigo e
              metadados dos algoritmos. Você vê bytes em hex, cálculos
              intermediários e pode acompanhar cada etapa do processo.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Informações técnicas detalhadas</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Validações e cálculos no navegador</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Pseudocódigo e exemplos de implementação</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Ideal para entender implementações</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-zinc-300">
          <span className="font-semibold text-amber-300">Dica:</span> A escolha
          do modo é salva no seu navegador. Você pode trocar a qualquer momento
          usando o botão no canto superior direito de cada ferramenta.
        </div>
      </section>

      {/* Tech Stack */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Stack tecnológica</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <SiNextdotjs size={14} aria-hidden /> Next.js 16 (App Router)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <SiOpenjdk size={14} aria-hidden /> Java 17
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <SiSpring size={14} aria-hidden /> Spring Boot 3.3.6
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <SiDocker size={14} aria-hidden /> Docker + Compose
          </span>
        </div>
        <p className="mt-3 text-sm text-zinc-400">
          Frontend estático + backend em container. Pode rodar localmente ou
          fazer deploy em qualquer provedor cloud.
        </p>
      </section>

      {/* Repository Link */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Explore o código-fonte
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Todo o projeto está disponível publicamente no GitHub
        </p>
        <a
          href="https://github.com/yagoprssantos/SegurancaDigital"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
        >
          <FiGithub size={18} />
          Ver repositório no GitHub
        </a>
      </section>
    </div>
  );
}
