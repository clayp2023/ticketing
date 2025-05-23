import { Publisher, OrderCreatedEvent, Subjects } from '@boolsheot/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}