# Demo Backend — API (Spring Boot)

API demo em Spring Boot que expõe operações de criptografia e análise usadas pela interface web.

Visão geral

- Código: `demo-backend/src/main/java/br/com/segurancadigital/demo/`
- Porta padrão: `8080`

Pré-requisitos

- Java JDK 8+ (com `JAVA_HOME` configurado)
- Wrapper Maven incluído (usa `./mvnw` / `mvnw.cmd`)

Execução (desenvolvimento)

```bash
cd demo-backend
# macOS / Linux
./mvnw spring-boot:run

# Windows PowerShell
.\mvnw.cmd spring-boot:run
```

Build e execução do JAR

```bash
cd demo-backend
./mvnw clean package
java -jar target/*.jar
```

Executar via Docker (opcional)

```bash
docker build -t seguranca-digital-backend demo-backend
docker run -p 8080:8080 seguranca-digital-backend
```

Principais endpoints (resumo)

- `GET /health` — retorna `{ "ok": true }` (verificação básica)
- `POST /sha256` — corpo: `{ "text": "..." }` → retorna `{ "hashHex": "..." }`
- `POST /aes/encrypt` — `{ "plaintext":"...", "key":"16charKey..." }` → `{ "ciphertextBase64": "..." }`
- `POST /aes/decrypt` — `{ "ciphertextBase64":"...", "key":"..." }` → `{ "plaintext":"..." }`
- `POST /vigenere/encrypt` — `{ "message":"...", "password":"..."" }` → `{ "cipherHex":"..." }`
- `POST /vigenere/decrypt` — `{ "cipherHex":"...", "password":"..." }` → `{ "message":"..." }`
- `POST /diffie-hellman/public` — `{ "privateKey":"<int>" }` → `{ "publicKey":"<int>" }`
- `POST /diffie-hellman/shared` — `{ "privateKey":"<int>", "otherPublicKey":"<int>" }` → `{ "sharedKey":"<int>" }`
- `POST /quebra-vigenere/run` — `{ "keyLength": 9 }` → tentativa de quebra (demo)
- `POST /quebra-otp/run` — `{ "indexA":0, "indexB":1, "crib":"knowntext" }` → XOR/derived
- `POST /crack-de-senha/run` — `{ "mode":"numeric" }` ou `{ "mode":"alpha" }` — execução limitada para demo

Exemplo (curl):

```bash
curl -s http://localhost:8080/health

curl -s -X POST http://localhost:8080/sha256 -H 'Content-Type: application/json' -d '{"text":"hello"}'
```

Notas

- Os endpoints têm validações e limites aplicados para manter o backend seguro e adequado a execução em demos.
- Para detalhes, consulte a implementação em `demo-backend/src/main/java/.../web/ToolController.java`.

Arquivo de referência: [../README.md](../README.md)
