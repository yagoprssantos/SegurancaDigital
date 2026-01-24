# Segurança Digital

## Tabela de Conteúdos

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Requisitos](#requisitos)
3. [Como usar as ferramentas (`src/`)](#como-usar-as-ferramentas-src)
4. [Funcionalidades](#funcionalidades)
5. [Estrutura do Projeto](#estrutura-do-projeto)

## Sobre o Projeto

Coleção de implementações e ferramentas educativas para estudar criptografia, análise de cifras e mecanismos de segurança, contendo diversos módulos em Java com implementações e exercícios.

## Requisitos

- Java JDK 8+

Clone o repositório:

```bash
git clone https://github.com/yagoprssantos/seguranca-digital.git
cd seguranca-digital
```

## Como usar as ferramentas (`src/`)

O diretório `src/` contém implementações e exercícios em Java. Use [src/README.md](src/README.md) como índice rápido dos módulos e para instruções básicas de compilação. Cada módulo idealmente mantém seu próprio `README.md` com exemplos executáveis.

## Funcionalidades

- Implementações de algoritmos clássicos e modernos de criptografia (AES, Vigenère, SHA-256).
- Ferramentas de análise/ataque educacional (Quebra de Vigenère, Quebra OTP, Crack de Senha).
- Demonstração de protocolo de troca de chaves (Diffie-Hellman).

## Estrutura do Projeto

```
seguranca-digital/
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

- **src/**: Códigos-fonte das ferramentas e implementações em Java. Cada subdiretório contém seu próprio README com instruções detalhadas (ver [src/README.md](src/README.md)).
- **docs/**: Materiais de apoio, referências e anotações relacionadas aos tópicos de segurança digital.
