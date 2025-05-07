import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

import { errorHandler, NotFoundError } from '@boolsheot/common';

const app = express();

app.set('trust proxy', true); //traffic is proxied to express via nginx
                              //express is aware that it is behind the nginx proxy
                              //and it should trust the traffic

app.use(json());

app.use(
    cookieSession({
        signed: false,
        //secure: true //enable https
        //secure: process.env.NODE_ENV !== 'test'
        secure: false
    })
);

app.use(currentUserRouter);

app.use(signinRouter);

app.use(signupRouter);

app.use(signoutRouter);


//non express way to handle async with errors
app.all('*', async (req, res) => {
    //install the package for express-async-errors
    //>npm install express-async-errors
    throw new NotFoundError(); 
});

app.use(errorHandler);

export { app };
