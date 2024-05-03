import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express()
const port = 3000

let sseClients = [];
let messages = [
    {
        date: '2024-05-02T11:05:34.019Z',
        text: 'Hello @John, lets test out this new chat feature',
        username: 'Jane',
        userId: '1',
    },
    {
        date: '2024-05-02T11:08:34.019Z',
        text: 'nice, its in realtime already!',
        username: 'John',
        userId: '2',
    }
];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/api/messages', (req, res) => {
    res.json({
        success: true,
        messages: messages.map((message) => {
            message.type = message.userId === req.query.userId ? 'outgoing' : 'incoming';
            return message;
        }),
    });
})

app.post('/api/messages', (req, res) => {
    const message = req.body;

    if (message.userId === '1') {
        message.username = 'Jane';
    } else if (message.userId === '2') {
        message.username = 'John';
    }

    messages.push(message);

    sseClients
      .filter(client => client.userId !== message.userId)
      .forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));

    res.json({
        success: true,
        message
    });
})

app.get('/api/sse', (req, res) => {
    const userId = req.query.userId;
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const newClient = {
        userId,
        res
    };

    sseClients.push(newClient);

    req.on('close', () => {
        console.log(`${userId} connection closed`);
        sseClients = sseClients.filter(client => client.userId !== userId);
    });
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
