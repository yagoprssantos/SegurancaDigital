# Códigos-fonte — Implementações e ferramentas

Este arquivo é um índice rápido para os módulos de código em `src/`. Objetivos:

- Resumir o propósito de cada módulo;
- Informar pré-requisitos e um passo-a-passo mínimo para compilar/executar;
- Apontar para o README de cada módulo quando houver detalhes ou exemplos.

## Pré-requisitos

- Java JDK 8+ (com `JAVA_HOME` configurado)
- (Opcional) IDE/Editor: IntelliJ, Eclipse, VSCode

## Compilar & executar — guia rápido

1. Abra um terminal na pasta do módulo (ex: `src/AES`).
2. Se existir `README.md` no módulo, siga aquele arquivo.
3. Exemplo genérico de compilação via terminal:

```bash
# dentro de src/<Modulo>/
mkdir -p bin
javac -d bin $(find . -name "*.java")
```

No Windows PowerShell substitua o `find` por um wildcard (`Get-ChildItem -Recurse -Filter *.java`) ou use sua IDE.

Exemplo genérico de execução:

```bash
java -cp bin NomeDaClassePrincipal
```

Quando o módulo trouxer `pom.xml` ou scripts, use Maven/Gradle/IDE conforme indicado.

## Módulos disponíveis

- `AES/` — Implementação didática do AES.
- `CriptografiaVigenere/` — Cifra de Vigenère e exemplos.
- `DiffieHellman/` — Exemplo de troca de chaves Diffie-Hellman.
- `CrackDeSenha/` — Demonstração/experimentos de ataques de senha (uso educacional).
- `QuebraOTP/` — Dados e utilitários para estudos de OTP.
- `QuebraVigenere/` — Ferramentas para análise e quebra de Vigenère.
- `SHA256/` — Implementação e visualização do SHA-256.

Cada pasta idealmente contém um `README.md` com instruções específicas e exemplos de execução.

---

Para informações gerais sobre a demo e execução local, consulte o README principal: [../README.md](../README.md).
