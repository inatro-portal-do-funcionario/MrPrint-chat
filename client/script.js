// client/script.js
// Ajuste o SERVER para a URL do seu backend (deploy). Ex: https://mrprint-chat-npl.vercel.app
const SERVER = 'https://mrprint-chat-npl.vercel.app'; // <<-- já configurado para você
const socket = io(SERVER);

const usernameInput = document.getElementById('username');
const enterBtn = document.getElementById('enterBtn');
const usersList = document.getElementById('users');
const messagesEl = document.getElementById('messages');
const textInput = document.getElementById('text');
const sendBtn = document.getElementById('sendBtn');

let username = null;

function appendMessage(content, kind='other') {
  const d = document.createElement('div');
  d.className = 'msg ' + (kind === 'me' ? 'me' : 'other');
  d.innerHTML = content;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

enterBtn.addEventListener('click', () => {
  const v = usernameInput.value.trim();
  if (!v) return alert('Digite seu nome');
  username = v;
  socket.emit('join', { username });
  usernameInput.disabled = true;
  enterBtn.disabled = true;
});

sendBtn.addEventListener('click', sendMessage);
textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

function sendMessage() {
  const txt = textInput.value.trim();
  if (!txt) return;
  socket.emit('message', { text: txt });
  appendMessage(`<strong>${escapeHtml(username)}</strong>: ${escapeHtml(txt)}<div class="meta">${new Date().toLocaleTimeString()}</div>`, 'me');
  textInput.value = '';
}

socket.on('connect', () => console.log('Conectado ao servidor'));
socket.on('message', (m) => {
  if (m.username === username) return;
  appendMessage(`<strong>${escapeHtml(m.username)}</strong>: ${escapeHtml(m.text)}<div class="meta">${new Date(m.ts).toLocaleTimeString()}</div>`, 'other');
});
socket.on('system_message', (m) => {
  appendMessage(`<em>${escapeHtml(m.text)}</em><div class="meta">${new Date(m.ts).toLocaleTimeString()}</div>`, 'other');
});
socket.on('users', (list) => {
  usersList.innerHTML = '';
  list.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u;
    usersList.appendChild(li);
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
