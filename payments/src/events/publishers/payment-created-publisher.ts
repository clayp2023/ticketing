import { Subjects, Publisher, PaymentCreatedEvent } from "@boolsheot/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}