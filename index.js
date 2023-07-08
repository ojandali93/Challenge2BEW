const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let onlineUsers = {}

io.on('connection', (socket) => {

    socket.on('new user', (nickname) => {
        onlineUsers[socket.id] = nickname;
        io.emit("new user", nickname)
        socket.broadcast.emit("chat message", `${nickname} is online.`);
    })
    
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });

    socket.on('user disconnected', () => {
        const disconnectedUser = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        io.emit("user disconnected", disconnectedUser)
        io.emit("chat message", `${disconnectedUser} is offline.`);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});