import { Publisher, Subjects, TicketUpdatedEvent } from "@boolsheot/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    
}