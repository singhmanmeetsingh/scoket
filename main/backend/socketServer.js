// this is the socket server 
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express()

const httpServer = http.createServer(app);



const PORT = process.env.PORT || 8000;

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});





app.use(cors({
    origin: 'http://localhost:3000'
}))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("mouse-movement", (movement) => {
        console.log(`from frontend`, movement);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});




httpServer.listen(PORT, () => {
    console.log('Example app listening on port 8000!')
})
