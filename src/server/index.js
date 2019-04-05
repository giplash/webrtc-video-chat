import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';

const app = express();

app.use(express.static('dist'));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

server.listen(
    process.env.PORT || 8080,
    () => console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
