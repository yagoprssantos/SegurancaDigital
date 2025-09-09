# SHA256

Este diretório contém uma implementação em Java para cálculo do hash SHA-256, incluindo uma interface gráfica simples para uso didático. O objetivo é demonstrar o conceito de resumo unidirecional de mensagens, fundamental em Segurança Computacional.

## Sobre o SHA-256

SHA-256 é uma função hash criptográfica amplamente utilizada para garantir integridade e autenticação de dados. Ela transforma qualquer entrada em um resumo (hash) de 256 bits, de forma determinística e praticamente irreversível.

## Funcionamento do código

- O arquivo `SHA256.java` implementa o cálculo do hash SHA-256 usando a biblioteca padrão do Java (`MessageDigest`).
  - O método `calcular(String texto)` recebe uma string, calcula o hash e retorna o valor em hexadecimal.
- O arquivo `Visao.java` fornece uma interface gráfica (Swing) para digitar um texto e visualizar seu hash SHA-256.
  - O usuário digita o texto, clica em "Calcular" e o hash é exibido na tela.

## Relação com a disciplina

Este exercício permite compreender:

- O conceito de função hash criptográfica
- A importância do hash para integridade e autenticação
- O uso prático de funções hash em sistemas de segurança

Digite um texto na área indicada e clique em "Calcular" para ver o hash SHA-256 correspondente.
