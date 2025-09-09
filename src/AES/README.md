# AES

Este diretório contém uma implementação em Java do algoritmo de criptografia simétrica AES (Advanced Encryption Standard), utilizando modo CBC e padding PKCS5. O objetivo é demonstrar na prática o uso de criptografia moderna, fundamental em Segurança Computacional.

## Sobre o AES

AES é o padrão atual de criptografia simétrica, amplamente utilizado para proteger dados em sistemas reais. Ele opera sobre blocos de 128 bits e suporta chaves de 128, 192 ou 256 bits. O modo CBC (Cipher Block Chaining) adiciona aleatoriedade ao processo, tornando ataques mais difíceis.

## Funcionamento do código

- O arquivo `AES.java` implementa:
  - Criptografia (`encriptar`): Recebe um texto e uma chave, aplica AES/CBC/PKCS5Padding e retorna o resultado em Base64.
  - Descriptografia (`decriptar`): Recebe o texto cifrado (Base64) e a chave, recupera o texto original.
- O vetor de inicialização (IV) é fixo para fins didáticos.
- O programa solicita ao usuário:
  - O texto a ser criptografado
  - A chave (deve ter 16 caracteres para AES-128)
  - Realiza a criptografia e descriptografia, exibindo os resultados.

## Relação com a disciplina

Este exercício permite compreender:

- O funcionamento prático do AES
- A importância do modo de operação e do IV
- Boas práticas e limitações em criptografia simétrica

Siga as instruções no terminal para criptografar e descriptografar mensagens usando AES.
