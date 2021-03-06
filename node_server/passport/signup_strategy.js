const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../models/user');

const logger = require('../utils/logger');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    function(email, password, done) {
        const user = {
            email: email,
            password: password
        }
        new UserModel(user).save(function(err, user) {
            if (err && err.code && err.code === 11000) {
                logger.error('userModel saving error!', err);
                return done(null, false, {
                    error: 'duplicate email',
                    code: 100
                });
            }
            return done(null, user);
        });
    }
)
