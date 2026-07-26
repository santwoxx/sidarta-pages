# Sidarta Pages 🚀

Plataforma inteligente de criação e edição de páginas de alta conversão impulsionada por IA e modelos premium.

---

## 🏗️ Estrutura do Projeto

O repositório está organizado no formato **mono-repositório** modularizado para facilitar o deploy independente:

- **`frontend/`**: Aplicação Web estática (HTML, CSS e JavaScript) pronta para deploy na **Vercel**.
- **`backend/`**: Servidor API Node.js + Express pronto para deploy no **Render** (fornece rotas seguras para integração com APIs de IA: OpenAI, Anthropic e Gemini).

---

## 🚀 Como Rodar Localmente

### 1. Rodar o Backend (Render API)

```bash
cd backend
npm install
npm start
```
O servidor estará rodando em `http://localhost:5000`.

### 2. Rodar o Frontend (Vercel Client)

Em outro terminal:

```bash
cd frontend
npm start
```
Acesse a aplicação em `http://localhost:3000`.

---

## 🌐 Instruções de Deploy

### Deploy do Frontend na **Vercel**

1. Acesse o painel da [Vercel](https://vercel.com).
2. Adicione um novo projeto importando o repositório GitHub `https://github.com/santwoxx/sidarta-pages.git`.
3. Na configuração do projeto, altere o **Root Directory** para: `frontend`.
4. Clique em **Deploy**. A Vercel detectará o arquivo `vercel.json` e publicará seu site automaticamente com certificado SSL e rotas ativas.

### Deploy do Backend no **Render**

1. Acesse o painel do [Render](https://render.com).
2. Clique em **New +** e selecione **Blueprint**.
3. Conecte o repositório `https://github.com/santwoxx/sidarta-pages.git`. O Render lerá o arquivo `backend/render.yaml` automaticamente.
4. Adicione as variáveis de ambiente necessárias no painel do Render:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `GEMINI_API_KEY`
5. Salve e clique em **Deploy Service**.

---

## 🔑 Variáveis de Ambiente do Backend (`.env`)

Crie um arquivo `.env` dentro da pasta `backend/` para testes locais:

```env
PORT=5000
OPENAI_API_KEY=sua_chave_openai
ANTHROPIC_API_KEY=sua_chave_anthropic
GEMINI_API_KEY=sua_chave_gemini
```

---

## 📄 Licença

Desenvolvido para Sidarta Pages. Todos os direitos reservados.
