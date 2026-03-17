const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" }});
const cors = require('cors');

app.use(cors());
app.use(express.static(__dirname)); // serve index.html, style.css, client.js

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Store messages in memory (simple)
const channels = { general: [] };

io.on('connection', (socket) => {
  console.log('A user connected');

  // Join default channel
  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
    // Send existing messages to new user
    if (channels[channelId]) {
      socket.emit('loadMessages', channels[channelId]);
    }
  });

  socket.on('sendMessage', ({ channelId, user, message }) => {
    const msg = { user, message };
    if (!channels[channelId]) channels[channelId] = [];
    channels[channelId].push(msg);
    io.to(channelId).emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(3000, () => console.log('Server running on port 3000'));
