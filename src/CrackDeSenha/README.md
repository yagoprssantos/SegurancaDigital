# CrackDeSenha - Ferramenta de Teste de Senhas

Este módulo contém uma pequena aplicação Java para demonstração de técnicas básicas de tentativa de acesso (cracking) de senhas para fins educacionais e de segurança. Use apenas em ambientes de teste e com permissão explícita.

## Objetivo

Demonstrar métodos simples de verificação e tentativa de senhas (por exemplo, força bruta ou dicionário) e mostrar como medidas de proteção (hashing, sal, políticas de senha) ajudam a mitigar ataques.

## Conteúdo

- `src/CrackDeSenha.java` — implementação principal (simples) que demonstra verificação de senhas.
- `lib/` — dependências (se houver).

## Como compilar

No diretório raiz do módulo execute:

```bash
javac src/CrackDeSenha.java
```

## Como executar

```bash
java -cp src CrackDeSenha
```

O programa pedirá entradas via console. Siga as instruções apresentadas ao executar.

## Aviso de uso

Este código é apenas educacional. Não deve ser usado para atacar sistemas reais. Sempre obtenha autorização explícita antes de testar a segurança de qualquer sistema.

## Sugestões de extensão

- Implementar um modo de "dicionário" usando um arquivo de palavras
- Adicionar suporte a threads para testar ataques de força bruta em paralelo (apenas para demonstração)
- Mostrar comparação entre senhas em texto simples e armazenadas como hashes com salt

## Estrutura

```bash
CrackDeSenha/
├── src/
│   └── CrackDeSenha.java
├── lib/
└── README.md
```

## Referências

- Conceitos de segurança de senhas e boas práticas (hashing, sal, políticas de senha).
