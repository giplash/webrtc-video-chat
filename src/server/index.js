import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';

const app = express();

app.use(express.static('dist'));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    socket.on('join', room => {
        socket.join(room, () => {
            socket.on('ready', () => {
                socket.broadcast.to(room).emit('ready', socket.id);
            });
            socket.on('offer', (id, message) => {
                socket.to(id).emit('offer', socket.id, message);
            });
            socket.on('answer', (id, message) => {
                socket.to(id).emit('answer', socket.id, message);
            });
            socket.on('candidate', (id, message) => {
                socket.to(id).emit('candidate', socket.id, message);
            });
            socket.on('disconnect', () => {
                socket.broadcast.to(room).emit('bye', socket.id);
            });
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(
    process.env.PORT || 8080,
    () => console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
