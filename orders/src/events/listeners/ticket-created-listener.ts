import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@boolsheot/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    queueGroupName = queueGroupName; //ensures only one instance receives the event

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        //'data' pertinant information of the raise event
        //msg from NATS

        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        }); //save this to the ticket collection of orders
        await ticket.save();


        //now acknowledge the message
        msg.ack();
    }
}