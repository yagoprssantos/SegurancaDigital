import Link from 'next/link';
import { FiDatabase, FiLock, FiShield } from 'react-icons/fi';

export default function PrivacyPage() {
  return (
    <div className="grid gap-10 sm:gap-12">
      <section className="grid gap-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Privacidade
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-400">
          Transparência sobre quais dados esta demo usa e armazena.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300">
              <FiLock size={20} aria-hidden />
            </div>
            <h2 className="text-lg font-semibold">Sem conta</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Esta aplicação não exige login e não cria perfis de usuário.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <FiDatabase size={20} aria-hidden />
            </div>
            <h2 className="text-lg font-semibold">Armazenamento local</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Para melhorar a experiência, o navegador pode salvar preferências
            (ex.: modo Iniciante/Debug) e a lista de ferramentas recentes via
            <span className="font-mono"> localStorage</span>.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
            <FiShield size={20} aria-hidden />
          </div>
          <h2 className="text-lg font-semibold">Dados enviados ao backend</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          Quando você executa uma ferramenta, os dados informados podem ser
          enviados ao backend (por exemplo, para calcular hashes ou cifras). O
          backend pode registrar logs operacionais dependendo de como você
          executa o servidor.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Recomendação: não envie informações sensíveis. Para maior controle,
          rode o projeto localmente.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Dúvidas</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Se encontrar algum problema ou tiver sugestão de melhoria, abra uma
          issue no repositório.
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
          >
            Voltar ao início
          </Link>
          <Link
            href="/termos"
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-amber-300"
          >
            Termos de uso
          </Link>
        </div>
      </section>
    </div>
  );
}
