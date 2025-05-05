import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {

    //abstract subject: string; //name of the channel this listener is going to listen for
    abstract subject: T['subject'];
    abstract queueGroupName: string; //functin to run when a message is received
    //abstract onMessage(data: any, msg: Message): void;
    abstract onMessage(data: T['data'], msg: Message): void;

    private client: Stan; //pre-initialized NATS client
    protected ackWait = 5*1000; //number of seconds this listener has to ack a message
                                //protected, if the client wants to change it
    

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        //default subscription options
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable() //NEEDED all events that have ever been emitted for this channel *during first time*
            .setManualAckMode(true)
            .setAckWait(this.ackWait) //customize the timeout period
            .setDurableName(this.queueGroupName); //same as queuegroup to make sense
    }

    listen() {
        //code to set up the subscription
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            //function to run when a message is received
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        //helper function to parse a message
        //buffer or string
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }    
}
