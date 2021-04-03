const socket = io();
const chatForm = document.querySelector('#chat-form');
const msgBox = document.querySelector('#msg');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const menu = document.querySelector('.fa-bars');
const close = document.querySelector('.fa-times');
const sidebar = document.querySelector('.chat-sidebar');

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', (message) => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('chatMessage', msgBox.value);
    msgBox.value = '';
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatMessages.appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `${users.map((user) => {
        return `<li>${user.username}</li>`
    }).join('')}`
}

menu.addEventListener('click', () => {
    menu.style.display = 'none';
    sidebar.style.display = 'block';
    sidebar.classList.add('trans')
    close.style.display = 'block'
});

close.addEventListener('click', () => {
    menu.style.display = 'block';
    sidebar.style.display = 'none';
    close.style.display = 'none'
});