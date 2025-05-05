import { Publisher, OrderCancelledEvent, Subjects } from '@boolsheot/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}