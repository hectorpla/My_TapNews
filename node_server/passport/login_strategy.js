const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');
const tokenSecret = require('../config/config').tokenSecret;

const logger = require('../utils/logger');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    function(email, password, done) {
        logger.info('login strategy', email + " " + password)
        UserModel.findOne({ email: email}, function(err, user) {
            if (err) { return done(err); }

            const credentialFailInfo = {
                error: "email or password not valid",
                code: 101 
            }

            if (!user) { 
                return done(null, false, credentialFailInfo); // unauthorized
            }

            user.comparePassword(password)
                .then(function(matched) {
                    if (!matched) {
                        return done(null, false, credentialFailInfo);
                    }
                    jwt.sign({ id: user._id }, tokenSecret, function(err, token) {
                        if (err) { return done(err); }
                        return done(null, token);
                    })                    
                })
        })
    }
)