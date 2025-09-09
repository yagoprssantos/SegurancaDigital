# CriptografiaVigenere

Este diretório contém a implementação em Java da cifra de Vigenère, um clássico da criptografia simétrica por substituição polialfabética. O código permite criptografar e descriptografar mensagens utilizando uma senha, demonstrando conceitos fundamentais da disciplina de Segurança Computacional.

## Sobre a cifra de Vigenère

A cifra de Vigenère utiliza uma palavra-chave (senha) para embaralhar o texto original (mensagem), tornando a análise de frequência menos eficaz do que em cifras simples como a de César. É um exemplo importante de como a segurança de um sistema criptográfico depende tanto do algoritmo quanto do segredo compartilhado.

## Funcionamento do código

O programa solicita ao usuário:

- A mensagem a ser criptografada ou descriptografada
- A escolha da operação (1 para criptografar, 2 para descriptografar)
- A senha (palavra-chave)

O usuário pode testar diferentes senhas para a mesma mensagem, observando como a escolha da chave afeta o resultado.

### Principais funções

- `encriptar(mensagem, senha)`: Aplica a cifra de Vigenère para criptografar a mensagem.
- `decriptar(mensagem, senha)`: Reverte a cifra, recuperando o texto original.

O código utiliza operações de soma e subtração de caracteres, baseando-se na posição das letras no alfabeto, repetindo a senha conforme necessário.

## Relação com a disciplina

Este exercício permite compreender na prática:

- O conceito de cifra por substituição polialfabética
- A importância da escolha da chave
- Limitações de cifras clássicas frente a ataques modernos

Siga as instruções no terminal para criptografar ou descriptografar mensagens.
