const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {formatMessage} = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRooms} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));
const botName = 'Admin';

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage(botName, 'Welcome to connectify'));
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRooms(user.room)
        });
    });
    
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRooms(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server is up and running');
});