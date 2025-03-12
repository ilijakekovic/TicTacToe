require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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

function checkWin(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // List all available rooms
    socket.on('getAvailableRooms', () => {
        const availableRooms = Object.keys(games).filter(room => games[room].players.length < 2);
        socket.emit('availableRooms', availableRooms);
    });

    // List all rooms with their statuses
    socket.on('getAllRooms', () => {
        const allRooms = Object.keys(games).map(room => {
            const game = games[room];
            const status = game.players.length === 2 ? 'Playing' : 'Waiting';
            return { name: room, status, playerCount: game.players.length };
        });
        console.log('Emitting all rooms:', allRooms); // Add logging to debug
        socket.emit('allRooms', allRooms);
    });

    // Player joins a game room
    socket.on('joinGame', (room) => {
        socket.join(room);
        console.log(`Player - ${socket.id} - joined room: ${room}`);

        // Check if the room exists, else create a new game state
        if (!games[room]) {
            games[room] = { board: Array(9).fill(null), turn: 'X', players: [] };
        }

        // Add player if room isn't full and not already added
        if (games[room].players.length < 2 && !games[room].players.includes(socket.id)) {
            games[room].players.push(socket.id);
        }

        // Assign player symbols
        if (games[room].players.length === 1) {
            games[room].playerSymbols = { [socket.id]: 'X' };
        } else if (games[room].players.length === 2) {
            games[room].playerSymbols[socket.id] = 'O';
        }

        // Send game state to the player
        io.to(room).emit('gameState', games[room]);

        // Emit the number of connected users
        io.to(room).emit('userCount', games[room].players.length);
    });

    // Handle player moves
    socket.on('makeMove', ({ room, index }) => {
        console.log(`Received makeMove event from player ${socket.id} in room ${room} at index ${index}`);
        const game = games[room];

        if (game && game.board[index] === null && game.players.includes(socket.id) && game.turn === game.playerSymbols[socket.id]) {
            game.board[index] = game.turn;
            game.turn = game.turn === 'X' ? 'O' : 'X';

            const winner = checkWin(game.board);
            if (winner) {
                io.to(room).emit('gameState', game);
                io.to(room).emit('gameResult', { winner });
            } else {
                io.to(room).emit('gameState', game);
            }
        } else {
            console.log(`Invalid move by player ${socket.id} in room ${room} at index ${index}`);
        }
    });

    // Handle chat messages
    socket.on('sendMessage', ({ room, message, sender }) => {
        const timeStamp = new Date().toLocaleTimeString();
        const chatMessage = { sender, message, timeStamp };
        io.to(room).emit('receiveMessage', chatMessage);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);

        // Remove the player from the game
        for (const room in games) {
            games[room].players = games[room].players.filter(player => player !== socket.id);
            if (games[room].players.length === 0) {
                delete games[room]; // Delete the game if no players are left
            } else {
                // Emit the updated number of connected users
                io.to(room).emit('userCount', games[room].players.length);
            }
        }
    });

    // Create a new game room
    socket.on('createRoom', (roomName) => {
        if (games[roomName]) {
            socket.emit('roomExists', roomName); // Room already exists
        } else {
            games[roomName] = { board: Array(9).fill(null), turn: 'X', players: [socket.id], playerSymbols: { [socket.id]: 'X' } }; // Create new room
            socket.join(roomName);
            socket.emit('roomCreated', roomName); // Inform client room was created
            io.to(roomName).emit('userCount', games[roomName].players.length); // Emit the number of connected users
        }
    });
});