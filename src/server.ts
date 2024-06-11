import { createServer } from "node:http";
import { Server } from "socket.io";

const server = createServer()
    .listen(3000, "127.0.0.1");
const io = new Server(
    server,
    { connectionStateRecovery: {} }
);

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});