import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@boolsheot/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();

app.set('trust proxy', true); //traffic is proxied to express via nginx
                              //express is aware that it is behind the nginx proxy
                              //and it should trust the traffic

app.use(json());

app.use(
    cookieSession({
        signed: false,
        //secure: true //enable https
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUser);

app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);


//non express way to handle async with errors
app.all('*', async (req, res) => {
    //install the package for express-async-errors
    //>npm install express-async-errors
    throw new NotFoundError(); 
});

app.use(errorHandler);

export { app };
