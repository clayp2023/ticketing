import { Publisher, Subjects, TicketCreatedEvent } from "@boolsheot/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {

    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    
}