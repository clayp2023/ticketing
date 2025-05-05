import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    BadRequestError
} from '@boolsheot/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', 
    requireAuth, 
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')    
            .isFloat({ gt: 0})
            .withMessage('Price must be provided and must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }

    if(ticket.orderId) {
        throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save(); //wait for the record to be persisted to mongo

    //emit update event
    //no waiting for the event to be published to nats
    //this yeilds the opportunity to send an error response
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.send(ticket);
});

export { router as updateTicketRouter };