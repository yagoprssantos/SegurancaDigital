# Diffie-Hellman - Troca Segura de Chaves

Este módulo implementa o protocolo **Diffie-Hellman** para troca segura de chaves criptográficas entre duas partes, sem que um observador possa descobrir a chave secreta compartilhada.

## 📋 Sobre o Algoritmo

O protocolo Diffie-Hellman permite que duas partes estabeleçam uma chave secreta compartilhada através de um canal público inseguro. Baseia-se na dificuldade do problema do logaritmo discreto em grupos finitos.

### Funcionamento

1. **Parâmetros públicos**: Dois valores primos `p` e `g` são conhecidos por ambas as partes
2. **Chaves privadas**: Cada parte escolhe uma chave secreta privada
3. **Chaves públicas**: Cada parte calcula e envia sua chave pública usando `g^(chave_privada) mod p`
4. **Chave compartilhada**: Ambas as partes calculam a mesma chave secreta usando a chave pública da outra parte

## 🎯 Implementação

### Parâmetros utilizados

- **p** (primo): `102031405123416071809152453627382938465749676859789`
- **g** (gerador): `1234567890123456789012345`

### Características

- Utiliza `BigInteger` para suportar números muito grandes
- Interface interativa via console
- Demonstra o processo completo de troca de chaves

## 🚀 Como usar

### Compilação

```bash
javac src/DiffieHellman.java
```

### Execução

```bash
java -cp src DiffieHellman
```

### Exemplo de uso

```text
Eu, escolha a sua chave secreta: 12345
Sua chave pública é: 75829305719403826484029318493812546187299742346592
Outro, informe a sua chave pública: 45689123456789012345678901234567890123456789
Nossa chave compartilhada é: 98765432109876543210987654321098765432109876
```

## 🔐 Segurança

- A segurança baseia-se na dificuldade de calcular logaritmos discretos
- Os valores primos escolhidos oferecem boa segurança para demonstrações
- **Importante**: Em aplicações reais, use parâmetros padronizados e validados

## 📂 Estrutura do Projeto

```text
DiffieHellman/
├── src/
│   └── DiffieHellman.java    # Implementação principal
├── lib/                      # Dependências (vazio)
├── bin/                      # Arquivos compilados
└── README.md                 # Esta documentação
```

## 🎓 Conceitos Demonstrados

- **Criptografia de chave pública**
- **Matemática modular**
- **Protocolo de acordo de chave**
- **Segurança computacional**
- **Trabalho com números grandes em Java**
