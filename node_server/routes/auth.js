const express = require('express');
const passport = require('passport');

const UserModel = require('../models/user');
const validator = require('../utils/validator');
const logger = require('../utils/logger');

const bodyPaser = require('body-parser').json();
var router = express.Router();

// customized passport error handling
router.post('/signup', bodyPaser, validator, function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            info.success = false;
            return res.status(400).json(info); // return is neccesary
        }
        return res.json({ success: true, message: "you have signed up" })
    })(req, res, next);
});


router.post('/login', bodyPaser, function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        logger.verbose('user loging in', req.body, req.user);

        if (err) { return next(err); }
        if (!user) {
            info.success = false;
            return res.status(400).json(info);
        }
        const token = user;
        req.login(token, function(loginErr) {
            if (loginErr) { return next(loginErr); }
            return res.json({
                    success: true,
                    message: "you are logged in, keep your token",
                    token
            });
        })
    })(req, res, next);
});

module.exports = router;