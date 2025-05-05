import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

/*const client = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});*/

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

client.on('connect', () => {
    console.log('Listener connected to NATS');

    //const subscription = client.subscribe('ticket:created');

    client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    
    
    new TicketCreatedListener(client).listen();
}); 

process.on('SIGINT', () => {
    //interrupt signals
    client.close();
});

process.on('SIGTERM', () => {
    //terminate signals
    client.close();
});


