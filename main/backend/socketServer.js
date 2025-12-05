// this is the socket server 
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { getRandomColors } from './services/getRandomColors.js';

const app = express()

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8000;

console.log("frontend url", process.env.FRONTEND_CLIENT);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_CLIENT,
        methods: ['GET', 'POST']
    }
});


app.use(cors({
    origin: process.env.FRONTEND_CLIENT
}))


app.get('/', (req, res) => {
    res.send('Hello World!')
})




io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    const userColor = getRandomColors()


    socket.on("mouse-movement", (movement) => {
        console.log(`from frontend`, movement);
        console.log("color", userColor)
        socket.broadcast.emit('user-info', { userId: socket.id, color: userColor, user_mouse_movements: movement });
        // socket.emit('user-info', { userId: socket.id, color: userColor, user_mouse_movements: movement });
    })



    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});




httpServer.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})
