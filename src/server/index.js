import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();

app.use(express.static('dist'));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', socket => {
    socket.emit('server-test', 'Viktor')
});

server.listen(
    process.env.PORT || 8080,
    () => console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
