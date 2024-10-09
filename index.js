import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle webhook verification
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = '<INSERT_VERIFICATION_STRING_HERE>';  // Set up env variable

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Endpoint to handle incoming webhook POST events
app.post('/webhook', (req, res) => {
    const body = req.body;

    // Check if the webhook is from Instagram
    if (body.object === 'instagram') {
        console.log('Received Instagram Event:', body);

        // Handle each entry
        body.entry.forEach(entry => {
            if(entry.messaging){
                const message = entry.messaging[0];

                if (message.message) {
                    // Example: Log the message received
                    console.log('Message:', message.message.text);
                    console.log('Sender:', message.sender.id);
                    console.log('Recipient:', message.recipient.id);
                    console.log('Time:', new Date(message.timestamp).toISOString());


                } else if (message.postback) {
                    // Handle postbacks (if you have buttons)
                    console.log('Postback:', message.postback.payload);
                }
                else if (message.message_reactions) {
                    console.log('Message Reaction:', message.message_reactions);
                }
            }
            
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        // If not from Instagram, return 404
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
