import express from 'express';
import cors from 'cors';
import http from 'http';
const app = express()

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8000;
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.get('/', (req, res) => {
    res.send('Hello World!')
})
httpServer.listen(PORT, () => {
    console.log('Example app listening on port 8000!')
})
