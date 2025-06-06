import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { AnyBulkWriteOperation } from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper'); //mock the wrapper singleton

let mongo: any;

beforeAll(async () => {

    process.env.JWT_KEY = 'something in here';
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {

    jest.clearAllMocks();
    
    if(mongoose.connection.db){
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections){
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    if(mongo) {
        await mongo.stop();
    }
    //await mongoose.connection.close();
});

global.signin = (id?: string) => {

    //build a jwt payload.  {id, email }
    const payload = {
        //id: new mongoose.Types.ObjectId().toHexString(),
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    //create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //build up the session object. { jwt: MY_JWT }
    const session = { jwt: token };
    
    //turn that session into json
    const sessionJSON = JSON.stringify(session);

    //take the json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return a string that is the coookie with the encode data
    //get an example from the currentUser call cookie format
    return [`session=${base64}`];
};