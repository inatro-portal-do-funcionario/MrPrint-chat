# MrPrint Chat Npl

Versão pronta para deploy: frontend (GitHub Pages) + backend (Render/Vercel).

## Estrutura
- `client/` — frontend estático (pode ir para GitHub Pages)
  - `index.html`, `style.css`, `script.js`
- `server/` — backend Node.js com Socket.IO (deploy no Render ou Vercel)
  - `server.js`, `package.json`

## Deploy rápido
### Backend (Render)
1. Crie um repositório no GitHub com a pasta `server` no root (ou conecte Render ao repositório).
2. No Render, crie um novo **Web Service**, selecione o repositório e o diretório `/server` como root da build.
3. Comando de build: deixe vazio. Start command: `npm start`.
4. Defina `PORT` se necessário (Render atribui automaticamente). Após deploy, você terá uma URL tipo `https://mrprint-chat-backend.onrender.com`.

### Backend (Vercel) — Observação
- Vercel serverless não é ideal para WebSockets em instância serverless tradicional. Se quiser usar Vercel, escolha um plano com suporte a WebSockets ou use o "Vercel for Server" com um servidor sempre-on, ou prefira Render/Heroku/ Railway para websockets.

### Frontend (GitHub Pages)
1. Copie a pasta `client` para o repositório que será publicado no GitHub Pages (pasta root ou `docs/`).
2. No `script.js` ajuste a constante `SERVER` para a URL do backend (ex: `https://mrprint-chat-backend.onrender.com`).
3. Ative GitHub Pages nas configurações do repositório (branch `gh-pages` ou `main`/`docs/`), e publique.

## Notas de segurança
- Em produção, ajuste CORS para aceitar apenas a origem do seu frontend.
- Use HTTPS sempre.
- Proteja endpoints administrativos, autentique usuários e persista mensagens em banco (SQLite/Postgres) se quiser histórico.

## Como testar localmente
1. Rode o backend:
   ```bash
   cd server
   npm install
   npm start
   ```
2. Abra `client/index.html` no browser (ou sirva com `npx http-server client`).
3. Se o backend estiver local, atualize `script.js` para `const SERVER = 'http://localhost:3000'`.

---
Bom estudo!

