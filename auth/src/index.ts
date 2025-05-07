import mongoose from 'mongoose';
import { app } from './app';

const startUp = async () => {

    console.log('starting up now...');
    console.log('second comment');
    //ensure environment variables are defined
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    try{
        //remember, the connection is not localhost, rather another pod via a running service
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Auth Service');
    }
    catch (err){
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('hi there, dude!  It is Tuesday');
        console.log('Auth Service listeing on port 3000!');
    });
};

startUp();