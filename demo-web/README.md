# Demo Web — Interface (Next.js)

Interface demo construída com Next.js para testar e visualizar os algoritmos e ferramentas do repositório.

Visão geral

- Código fonte: `demo-web/src/` (app + components)
- Porta padrão em dev: `3000`
- Configurações de API via variável `NEXT_PUBLIC_API_BASE_URL`

Pré-requisitos

- Node.js v16+ e `npm` (ou `yarn`/`pnpm`)

Instalação e execução (desenvolvimento)

```bash
cd demo-web
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Variáveis de ambiente

Copie o arquivo de exemplo e ajuste a URL do backend se necessário:

```bash
cp .env.local.example .env.local
# Exemplo de .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

A aplicação usa `NEXT_PUBLIC_API_BASE_URL` para localizar o backend. Se o backend estiver em outra URL, atualize essa variável.

Build e produção

```bash
npm run build
npm run start
```

Recomendações

- Inicie o `demo-backend` antes de testar fluxos que dependem de APIs.
- Use o navegador para abrir `http://localhost:3000` e ver os exemplos disponíveis na seção de ferramentas.

Arquivo de referência: [../README.md](../README.md)
