const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');


const port = process.env.PORT;
app.set('port', port);

const server = http.createServer(app);

//setup and use websockets
const io = socketio(server);
io.on('connection', (socket) => {
    //console.log('New Websocket connection!');


    socket.on('join', ({username, room}, callback) => {

        const user = addUser({ id: socket.id, username, room });
        if (user.error) {
            return callback(user.error);
        }

        socket.join(user.room);
        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', user.username + ' has joined!'));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    });

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter();

        const user = getUser(socket.id);

        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!');
        }
        io.to(user.room).emit('message', generateMessage(user.username, msg));
        callback();
    });

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateMessage(user.username, 'https://google.com/maps?q=' +
            location.latitude + ',' + location.longitude));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', user.username + ' has left'));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    });
});


server.listen(port);
