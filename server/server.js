// server/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors()); // Em produção, troque por lista de origens confiáveis.
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Ajuste para a URL do frontend em produção.
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('Novo cliente conectado', socket.id);

  socket.on('join', ({ username }) => {
    users.set(socket.id, { username });
    io.emit('users', Array.from(users.values()).map(u => u.username));
    io.emit('system_message', { text: `${username} entrou no chat.`, ts: Date.now() });
  });

  socket.on('message', (payload) => {
    const user = users.get(socket.id) || { username: 'Desconhecido' };
    const msg = {
      id: Date.now() + Math.random().toString(36).slice(2,8),
      username: user.username,
      text: payload.text,
      ts: Date.now()
    };
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('users', Array.from(users.values()).map(u => u.username));
      io.emit('system_message', { text: `${user.username} saiu do chat.`, ts: Date.now() });
    }
    console.log('Cliente desconectado', socket.id);
  });
});

app.get('/', (req, res) => res.send('MrPrint Chat Npl - Server'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
