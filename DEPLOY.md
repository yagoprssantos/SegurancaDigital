# 🚀 Guia de Deploy - SegurancaDigital

Este guia detalha como fazer o deploy completo do projeto **SegurancaDigital** usando **Render** para o backend (Spring Boot) e **Vercel** para o frontend (Next.js).

---

## 📋 Pré-requisitos

- Conta no [Render](https://render.com/) (gratuita)
- Conta no [Vercel](https://vercel.com/) (gratuita)
- Repositório no GitHub com o código atualizado

---

## 🔧 Parte 1: Deploy do Backend no Render

### 1.1. Criar o Web Service

1. Acesse https://dashboard.render.com/
2. Clique em **New +** → **Web Service**
3. Conecte seu repositório GitHub `yagoprssantos/SegurancaDigital`

### 1.2. Configurar o Serviço

Preencha os campos conforme abaixo:

| Campo | Valor |
|-------|-------|
| **Name** | `segurancadigital` (ou nome de sua preferência) |
| **Region** | `Ohio (US East)` ou mais próximo do Brasil |
| **Branch** | `demo` |
| **Root Directory** | `demo-backend` |
| **Runtime** | `Docker` |
| **Instance Type** | `Free` |

**IMPORTANTE:** Como estamos usando Docker, o Render vai detectar automaticamente o `Dockerfile` e fazer o build.

### 1.3. Variáveis de Ambiente (Opcional)

- O Render já define `PORT` automaticamente.
- Se precisar de outras variáveis no futuro, adicione em **Environment**.

### 1.4. Health Check

Após criar o serviço:

1. Vá em **Settings** → **Health & Alerts**
2. Configure:
   - **Health Check Path**: `/health`
   - **Health Check Interval**: `30` segundos

### 1.5. Deploy

- Clique em **Create Web Service**
- O Render vai:
  1. Clonar o repositório
  2. Executar `docker build` usando o Dockerfile
  3. Subir o container na porta que ele define via `PORT`
  
**Tempo estimado:** 3-5 minutos para o primeiro deploy.

### 1.6. Testar o Backend

Após o deploy, você terá uma URL pública:

```
https://segurancadigital.onrender.com
```

Teste no navegador:

```
https://segurancadigital.onrender.com/health
```

**Resposta esperada:**
```json
{"ok":true}
```

---

## 🌐 Parte 2: Deploy do Frontend no Vercel

### 2.1. Importar Projeto

1. Acesse https://vercel.com/import/git
2. Clique em **Import Git Repository**
3. Conecte sua conta do GitHub
4. Selecione o repositório `yagoprssantos/SegurancaDigital`

### 2.2. Configurar o Projeto

| Campo | Valor |
|-------|-------|
| **Project Name** | `segurancadigital-web` (ou nome de sua preferência) |
| **Framework Preset** | `Next.js` (detectado automaticamente) |
| **Root Directory** | `demo-web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 2.3. Variáveis de Ambiente

**CRÍTICO:** Configure a variável que aponta para o backend do Render.

1. Em **Environment Variables**, adicione:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://segurancadigital.onrender.com` | Production, Preview |

**⚠️ ATENÇÃO:** Substitua `segurancadigital.onrender.com` pela URL real do seu serviço Render!

### 2.4. Deploy

- Clique em **Deploy**
- A Vercel vai:
  1. Instalar dependências (`npm install`)
  2. Buildar o projeto (`npm run build`)
  3. Publicar o site

**Tempo estimado:** 1-2 minutos.

### 2.5. Testar o Frontend

Após o deploy, você terá uma URL pública:

```
https://seu-projeto.vercel.app
```

**Validações:**

1. ✅ A página inicial carrega
2. ✅ O footer mostra "Backend: Online" (status dinâmico do Render)
3. ✅ As ferramentas (AES, SHA-256, etc.) funcionam corretamente
4. ✅ Não há erros no console do navegador

---

## 🔄 Atualizações Automáticas

### Backend (Render)

- **Push para `demo`:** O Render faz deploy automático.
- **Logs:** Acessíveis em `Dashboard → segurancadigital → Logs`.

### Frontend (Vercel)

- **Push para `demo`:** A Vercel faz deploy automático.
- **Preview:** Cada PR gera um preview único.
- **Logs:** Acessíveis em `Dashboard → Deployments → [último deploy] → Build Logs`.

---

## 🧪 Desenvolvimento Local

### Backend

**Opção 1: Com Docker (recomendado)**

```bash
cd demo-backend
docker build -t segurancadigital-backend .
docker run --rm -p 8080:8080 segurancadigital-backend
```

Teste: http://localhost:8080/health

**Opção 2: Com JDK 17+ instalado**

```bash
cd demo-backend
./mvnw clean package -DskipTests
java -jar target/demo-backend-0.1.0.jar
```

### Frontend

1. Crie o arquivo `demo-web/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

2. Execute:

```bash
cd demo-web
npm install
npm run dev
```

Acesse: http://localhost:3000

**Para testar com o backend do Render localmente:**

```bash
# demo-web/.env.local
NEXT_PUBLIC_API_BASE_URL=https://segurancadigital.onrender.com
```

---

## 🛠️ Troubleshooting

### Backend não inicia no Render

**Erro:** `./mvnw: No such file or directory`

**Solução:** Certifique-se de que:
- A pasta `.mvn/` existe em `demo-backend/`
- Os arquivos `mvnw` e `mvnw.cmd` existem
- O Runtime está configurado como **Docker**

**Erro:** `no main manifest attribute`

**Solução:** Verifique que o Dockerfile contém:
```dockerfile
RUN ./mvnw -B clean package -DskipTests spring-boot:repackage
```

### Frontend mostra "Backend: Indisponível"

**Causa comum:** Variável de ambiente não configurada.

**Solução:**
1. Verifique em Vercel → Settings → Environment Variables
2. Confirme que `NEXT_PUBLIC_API_BASE_URL` está correta
3. Faça um **Redeploy** após adicionar a variável

### CORS Error no console do navegador

**Sintoma:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solução:** O backend já está configurado para aceitar qualquer origem em [CorsConfig.java](demo-backend/src/main/java/br/com/segurancadigital/demo/config/CorsConfig.java). Se o erro persistir, verifique:
- Se a URL do backend está correta na variável de ambiente
- Se o backend está online (teste `/health`)

---

## 📊 Monitoramento

### Status do Backend

O footer do site mostra um badge dinâmico:

- 🟢 **Online** - Backend respondendo normalmente
- 🔴 **Indisponível** - Backend offline ou com erro
- ⚪ **Verificando** - Checando status...

Este badge checa o endpoint `/health` a cada 30 segundos.

### Logs

- **Render:** Dashboard → Logs (tempo real)
- **Vercel:** Dashboard → Deployments → [deploy] → Build/Runtime Logs

---

## 🎯 Checklist Pós-Deploy

- [ ] Backend responde em `https://segurancadigital.onrender.com/health`
- [ ] Frontend carrega em `https://seu-projeto.vercel.app`
- [ ] Status badge no footer mostra "Online"
- [ ] Ferramentas (AES, SHA-256, Vigenere, etc.) funcionam
- [ ] Não há erros no console do navegador
- [ ] Não há erros nos logs do Render
- [ ] Não há erros nos logs da Vercel

---

## 📝 Notas Importantes

1. **Plano Free do Render:**
   - Serviços ficam inativos após 15 min sem requisições
   - Primeira requisição após inatividade pode demorar ~30s (cold start)
   - Para produção real, considere upgrade para plano pago

2. **Limites de Rate:**
   - Backend tem rate limiting configurado (veja [RequestGuardsFilter.java](demo-backend/src/main/java/br/com/segurancadigital/demo/config/RequestGuardsFilter.java))
   - Normal: 120 req/min por IP
   - Pesado (crack, quebra): 15 req/min por IP

3. **Segurança:**
   - CORS está aberto para qualquer origem (apenas para demo educacional)
   - Para produção, configure domínios específicos

---

## 🆘 Suporte

Se encontrar problemas:

1. Consulte os logs no Render/Vercel
2. Verifique as configurações das variáveis de ambiente
3. Teste endpoints individualmente com ferramentas como Postman/Insomnia
4. Abra uma issue no GitHub com:
   - Descrição do erro
   - Logs completos
   - Prints da configuração

---

**Última atualização:** 14/01/2026
