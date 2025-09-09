# QuebraVigenere

Este diretório contém um código em Java para análise e quebra da cifra de Vigenère, explorando técnicas de criptoanálise clássica. O exercício está diretamente relacionado ao estudo de vulnerabilidades em cifras polialfabéticas, tema central em Segurança Computacional.

## Sobre a cifra de Vigenère

A cifra de Vigenère, apesar de mais segura que cifras monoalfabéticas, pode ser quebrada por análise estatística quando a senha é curta ou reutilizada. O ataque clássico envolve descobrir o tamanho da chave e analisar a frequência das letras cifradas.

## Funcionamento do código

O programa:

- Possui um criptograma fixo (mensagem cifrada com Vigenère)
- Testa diferentes tamanhos de senha (de 3 a 12)
- Para cada posição da senha, calcula a letra mais frequente no texto cifrado correspondente
- Utiliza a suposição de que o caractere mais frequente no texto original é o espaço (' '), realizando XOR para estimar a chave

Esse processo automatiza parte da criptoanálise manual, mostrando como cifras clássicas podem ser vulneráveis a ataques estatísticos.

## Relação com a disciplina

Este exercício permite compreender:

- Como a análise de frequência pode quebrar cifras polialfabéticas
- A importância do tamanho e aleatoriedade da chave
- Limitações de métodos clássicos frente à criptoanálise

O programa exibirá tentativas de quebra para diferentes tamanhos de senha, ilustrando o processo de análise.
