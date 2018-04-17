
const socketIO = require('socket.io');
const { server } = require('./express-server');
const { Users } = require('./models/users');
const { generateMessage, generateLocation } = require('./models/message');


let users = new Users();
let io = socketIO(server);


const initIO = () => {
 
    io.on('connection', (socket) => {

        const joinListener=(params, callback)=> {
            if (!(params.name) || !(params.room)) {
                return callback('Name and room name are required.');
            }
                socket.join(params.room);
                users.removeUser(socket.id);
                users.addUser(socket.id, params.name, params.room);
        
                io.to(params.room).emit('updateUserList', users.getUserList(params.room));
                socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
                socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
                callback();
        };
        
        const createLocationListener=(coords)=> {
            var user = users.getUser(socket.id);
            if (user) {
                io.to(user.room).emit('newLocationMessage', generateLocation(user.name, coords.latitude, coords.longitude));
            }
        };
    
        const createMessageListener=(message, callback)=> {
            var user = users.getUser(socket.id);
            if (user && (message.text)) {
                io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            }
            callback();
        };
       
        const disconnectListener=()=> {
            var user = users.removeUser(socket.id);
    
            if (user) {
                io.to(user.room).emit('updateUserList', users.getUserList(user.room));
                io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            }
        };

        socket.on('join', joinListener);

        socket.on('createMessage', createMessageListener);

        socket.on('createLocationMessage', createLocationListener);

        socket.on('disconnect', disconnectListener);

        console.log('New user connected');
    });
}

module.exports = { initIO };
