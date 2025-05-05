import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@boolsheot/common';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req: Request, res: Response) => {
    

    /*const errors = validationResult(req);

    if(!errors.isEmpty()) {
        //res.status(400).send(errors.array());
        //throw new Error('Invalid email or password');
        throw new RequestValidationError(errors.array());
    }*/
    
    //does the email already exist
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }); //search across the entire store of users
    if(existingUser) {
      //console.log('Email is in user');
      //res.send({});
      throw new BadRequestError('Email in use');
    }

    //hash the passord

    //create the user
    const user = User.build({ email, password});
    await user.save();

    //generate the jwt
    /*const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, 'asdf');*/
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    // store the token on the session object
    //req.session.jwt = userJwt;
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user);

});

export { router as signupRouter };