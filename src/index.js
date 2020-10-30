const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const {generateMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom, getRoomList} = require('./utils/users');


const port = process.env.PORT;
app.set('port', port);

const server = http.createServer(app);

const isAuthorized = async (email, token) => {
    //try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        const user = await User.findOne({_id: decoded._id, email: email, 'tokens.token': token});
        if (!user) {
            throw new Error('not authenticated');
            //return callback('not authenticated');
         }
};

//setup and use websockets
const io = socketio(server);
io.on('connection', (socket) => {
    //console.log('New Websocket connection!');

    socket.on('getroomlist', () => {
        socket.join();
        socket.emit('roomlist', getRoomList());
    });


    socket.on('join', ({email, username, room, token}, callback) => {

        //validate user
        //check the validity of the token
        isAuthorized(email, token).then(() => {
            const user = addUser({id: socket.id, username, room});
            if (user.error) {
                return callback({status: 1,
                    msg: user.error});
            }

            socket.join(user.room);
            socket.emit('message', generateMessage('Admin', 'Welcome!'));
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', user.username + ' has joined!'));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
            callback();
        }).catch((e) => {
            return callback({status: 2, msg: e.message});
        });
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
            });
        }
    });
});


server.listen(port);
