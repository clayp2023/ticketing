import express from 'express'; 

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    //res.send('Hi there - signout');
    
    req.session = null; //tell the client browser to empty out headers and cookies
    res.send({});
});

export { router as signoutRouter };