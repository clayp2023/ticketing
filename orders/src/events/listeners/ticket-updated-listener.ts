import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@boolsheot/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        
        //const ticket = await Ticket.findById(data.id);
        const ticket = await Ticket.findByEvent(data);

        if(!ticket){
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });

        /*const { title, price, version } = data; //matched with pre save event
        ticket.set({ title, price, version }); //matched with pre save event*/

        await ticket.save();

        msg.ack();
    }
}