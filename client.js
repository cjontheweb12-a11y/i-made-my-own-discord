const socket = io('http://localhost:3000'); // replace with your hosted URL later
let currentChannel = 'general';

function joinChannel(channelId) {
  currentChannel = channelId;
  document.getElementById('messages').innerHTML = '';
  socket.emit('joinChannel', channelId);
}

socket.on('loadMessages', (msgs) => {
  msgs.forEach(msg => addMessage(msg.user, msg.message));
});

socket.on('receiveMessage', ({ user, message }) => {
  addMessage(user, message);
});

function sendMessage() {
  const input = document.getElementById('inputMessage');
  const message = input.value;
  if (!message) return;
  socket.emit('sendMessage', { channelId: currentChannel, user: 'You', message });
  input.value = '';
}

function addMessage(user, message) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${user}:</strong> ${message}`;
  document.getElementById('messages').appendChild(div);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}
