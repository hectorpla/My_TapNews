var passport = require('passport');
var LocalSignUpStrategy = require('./signup_strategy');
var LocalLogInStrategy = require('./login_strategy');

module.exports = function (app) {
    app.use(passport.initialize());
    // app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    })

    passport.deserializeUser(function(user, done) {
        done(null, user);
    })

    passport.use('local-signup', LocalSignUpStrategy);
    passport.use('local-login', LocalLogInStrategy);
}