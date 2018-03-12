const express = require('express');
const passport = require('passport');

const UserModel = require('../models/user');
const validator = require('../utils/validator');
const logger = require('../utils/logger');

const bodyPaser = require('body-parser').json();
var router = express.Router();


router.post('/signup', bodyPaser, validator,
    passport.authenticate('local-signup'), 
    function(req, res) {
        // TODO: response with the information about whether signup was successfully
        res.json({
            message: "OK"
        })
    }
)


router.post('/login', bodyPaser, function(req, res) {
    logger.info('user log in', req.body);
})

module.exports = router;