# Segurança Digital

## Tabela de Conteúdos

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Requisitos](#requisitos)
3. [Execução rápida (demo)](#execução-rápida-demo)
4. [Como usar as ferramentas (`src/`)](#como-usar-as-ferramentas-src)
5. [Funcionalidades](#funcionalidades)
6. [Estrutura do Projeto](#estrutura-do-projeto)

## Sobre o Projeto

Coleção de implementações e ferramentas educativas para estudar criptografia, análise de cifras e mecanismos de segurança. O repositório contém:

- Um conjunto de módulos em Java com implementações e exercícios (`src/`)
- Uma demo composta por backend (Spring Boot) e frontend (Next.js) para demonstrar e interagir com as ferramentas (`demo-backend`, `demo-web`)

## Requisitos

- Java JDK 8+ (para módulos Java e `demo-backend`)
- Node.js (recomendado v16+) e `npm` (para `demo-web`)

Clone o repositório:

```bash
git clone https://github.com/yagoprssantos/seguranca-digital.git
cd seguranca-digital
```

## Execução rápida (demo)

A demo é composta por duas partes que funcionam em conjunto:

- `demo-backend`: API em Spring Boot que expõe operações de criptografia/analise.
- `demo-web`: Aplicação Next.js que consome a API e oferece interface para testes.

Ordem recomendada:

1. Iniciar o backend (`demo-backend`) — porta padrão: `8080`.
2. Iniciar o frontend (`demo-web`) — porta padrão: `3000`.

Comandos rápidos:

```bash
# Iniciar backend (Linux/macOS)
cd demo-backend
./mvnw spring-boot:run

# Iniciar backend (Windows PowerShell)
cd demo-backend
.\mvnw.cmd spring-boot:run

# Iniciar frontend
cd demo-web
npm install
npm run dev
```

Links diretos:

- Backend: [demo-backend/README.md](demo-backend/README.md)
- Frontend: [demo-web/README.md](demo-web/README.md)

## Como usar as ferramentas (`src/`)

O diretório `src/` contém implementações e exercícios em Java. Use [src/README.md](src/README.md) como índice rápido dos módulos e para instruções básicas de compilação. Cada módulo idealmente mantém seu próprio `README.md` com exemplos executáveis.

## Funcionalidades

- Implementações de algoritmos clássicos e modernos de criptografia (AES, Vigenère, SHA-256).
- Ferramentas de análise/ataque educacional (Quebra de Vigenère, Quebra OTP, Crack de Senha).
- Demonstração de protocolo de troca de chaves (Diffie-Hellman).
- Backend demo em Spring Boot (`demo-backend`) para expor APIs de demonstração.
- Frontend demo em Next.js (`demo-web`) com interface para testar/visualizar as ferramentas.

## Estrutura do Projeto

```
seguranca-digital/
├── demo-backend/     # API demo (Spring Boot)
│   ├── mvnw, mvnw.cmd
│   ├── pom.xml
│   └── src/
├── demo-web/         # Aplicação web em Next.js (interface demo)
│   ├── package.json
   └── src/
├── docs/             # Materiais de apoio e referências
└── src/              # Implementações e ferramentas em Java
    ├── AES/
    ├── CrackDeSenha/
    ├── CriptografiaVigenere/
    ├── DiffieHellman/
    ├── QuebraOTP/
    ├── QuebraVigenere/
    └── SHA256/

```

### Módulos Principais

- **demo-backend/**: API demo em Spring Boot. Use `./mvnw spring-boot:run` (ou `mvn spring-boot:run`) para iniciar.
- **demo-web/**: Frontend em Next.js — comandos `npm install` e `npm run dev` iniciam a aplicação localmente.
- **src/**: Códigos-fonte das ferramentas e implementações em Java. Cada subdiretório contém seu próprio README com instruções detalhadas (ver [src/README.md](src/README.md)).
- **docs/**: Materiais de apoio, referências e anotações relacionadas aos tópicos de segurança digital.
