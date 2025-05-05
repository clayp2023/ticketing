import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const startUp = async () => {
    console.log('hi');
    //ensure environment variables are defined
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if(!process.env.NATS_URL){
        throw new Error('NATS_URL must be defined');
    }

    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    try{
        
        //await natsWrapper.connect('ticketing', 'clientIDabc123', 'http://nats-srv:4222');
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL
        );


        natsWrapper.client.on('close', () => {
            console.log('NATS connection for Payments Service closed!');
            process.exit();
        });

        process.on('SIGINT', () => {
            //interrupt signals
            natsWrapper.client.close();
        });
        
        process.on('SIGTERM', () => {
            //terminate signals
            natsWrapper.client.close();
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        
        //remember, the connection is not localhost, rather another pod via a running service
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Payments Service');
    }
    catch (err){
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Payments Service listeing on port 3000!');
    });
};

startUp();