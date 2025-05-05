import { Publisher, ExpirationCompleteEvent, Subjects } from '@boolsheot/common';

export class ExipriationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}