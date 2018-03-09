const express = require('express');

const UserModel = require('../models/user'); 
const logger = require('../logger');

const bodyPaser = require('body-parser').json();
var router = express.Router();


router.post('/signup', bodyPaser, function(req, res) {
    // TODO: response with the information about whether signup was successfully
    const body = req.body;
    logger.info('user sign up', body);
    if (!body.email || !body.password) {
        res.status(400).json({ 
            error: 'client side should specify email and password',
            code: 100 
        }); // temparary code
        return;
    }
    new UserModel(req.body).save(function(err, product) {
        if (err) {
            logger.error('userModel saving error!', err);
            res.status(400).json({
                error: 'duplicate email',
                code: 101
            });
        }
        res.json(product);
    });
})


router.post('/login', bodyPaser, function(req, res) {
    logger.info('user log in', req.body);
})

module.exports = router;