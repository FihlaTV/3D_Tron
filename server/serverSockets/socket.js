const chalk = require('chalk');
const store = require('../store');
const {
    createAndEmitUser,
    removeUserAndEmit,
    startReady,
    playerCollision
} = require('../reducers/users');


module.exports = io => {
    io.on('connection', socket => {
        console.log(chalk.yellow(`${socket.id} has connected`));

        // New user enters; create new user and new user appears for everyone else
        store.dispatch(createAndEmitUser(socket));
        const allUsers = store.getState().users;
        io.sockets.emit('addUser', allUsers);

        //Player ready in landing page
        //We need to update this so that game starting works smoothly

        socket.on('readyPlayer', (playerId) => {
            store.dispatch(startReady(playerId));
            const checkReadyUsers = store.getState().users;
            if (checkReadyUsers.length > 1 && checkReadyUsers.length === checkReadyUsers.filter(user => user.readyToPlay===true).length) {
            // if (users.filter(user => user.readyToPlay).length === 3) {
                io.sockets.emit('startGame');
            } 
            else{
            setTimeout(() => io.sockets.emit('startGame'), 3000)
          }
        });

        //Here the back end recognizes that a ball collided and sends out a syncronized message to all users to handle the collision. 
        socket.on('ball-collision', (playerData) => {
            io.sockets.emit('ball-collision-to-handle', playerData)
            if(playerData.id){
                console.log(chalk.red(playerData.id))
                store.dispatch(playerCollision(playerData.id))    
                console.log(chalk.red(store.getState().users.filter(user => user.active === true).length))
            }
            
            if(store.getState().users.filter(user => user.active === true).length <= 1){
                io.sockets.emit('endGame')
            }
        });

        //Here the back end recognizes a request to change direction emits to the front end that a given player is turning.
        socket.on('directionChange', (playerData) => {
            io.sockets.emit('sendTurn', playerData);
        });

        socket.on('disconnect', () => {
            store.dispatch(removeUserAndEmit(socket));
            console.log(chalk.magenta(`${socket.id} has disconnected`));
        });
    });
};
