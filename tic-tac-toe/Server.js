require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Socket } = require('dgram');
const { truncate } = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', //!!! change to a specific link (this currently allows any http origin to send a request which is not safe for production)
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let games = {}; // Stores active games


io.on('connection', (socket) => {
    console.log(`User Connected: ${Socket.id}`);

    // List all available rooms
    socket.on('getAvailableRooms', () => {
        const availableRooms = Object.keys(games).filter(room => games[room].players.length < 2);
        socket.emit('availableRooms', availableRooms);
    });

   // Player joins a game room
   socket.on('joinGame', (room) => {
    socket.join(room);
    console.log(`Player joined room: ${room}`);

    // Check if the room exists, else create a new game state
    if (!games[room]) {
        games[room] = { board: Array(9).fill(null), turn: 'X', players: [] };
    }

    // Add player if room isn't full
    if (games[room].players.length < 2) {
        games[room].players.push(socket.id);
    }

    // Send game state to the player
    io.to(room).emit('gameState', games[room]);
    });

    //Handle player moves
    socket.on('makeMove', ({room, index}) => {
        const game = games[room];

        if(game && game.board[index] === null && game.players.includes(socket.id)){
            game.board[index] = game.turn;
            game.turn = game.turn === 'X' ? 'O' : 'X';

            io.to(room).emit('gameState', game);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${Socket.id}`);

        //Remove the player from the game
        for (const room in games) {
            games[room].players = games[room].players.filter(player => player !== Socket.id);
            if(games[room].players.lenght ===0){
                delete games[room]; //Delete the game if no players are left
            }
        }
    });
})