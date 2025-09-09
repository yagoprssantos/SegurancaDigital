# QuebraOTP

Este diretório contém um código em Java para análise e ataque a cifras do tipo OTP (One-Time Pad), explorando vulnerabilidades quando o mesmo segredo é reutilizado. O exercício está diretamente relacionado ao estudo de criptografia e segurança da informação.

## Sobre o One-Time Pad (OTP)

O OTP é considerado teoricamente inquebrável quando a chave é verdadeiramente aleatória, do mesmo tamanho da mensagem e usada apenas uma vez. No entanto, a reutilização da chave compromete totalmente a segurança, permitindo ataques de berço (crib-dragging) e análise de criptogramas.

## Funcionamento do código

O programa:

- Inicializa uma coleção de criptogramas (mensagens cifradas) que foram criptografadas com a mesma chave.
- Permite ao usuário escolher dois criptogramas e inserir um "berço" (palavra ou trecho suspeito do texto original).
- Realiza operações XOR entre os criptogramas e o berço, auxiliando na descoberta de partes do texto original e, consequentemente, da chave.

Esse processo simula ataques reais a OTPs mal utilizados, reforçando a importância dos requisitos teóricos para a segurança do método.

## Relação com a disciplina

Este exercício demonstra:

- O conceito de segurança perfeita e suas condições
- Como a reutilização de chave em OTP permite ataques práticos
- A importância de boas práticas em criptografia

Siga as instruções no terminal para realizar ataques de berço e analisar os criptogramas.
