const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const logger = require('../logger');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    password: String,
})

// var saltRounds = 3;

userSchema.methods.comparedPassword = function(password, callback) {
    // don't handle error here
    return bcrypt.compare(password, this.password, callback);
};


// ERROR HANDLING: http://mongoosejs.com/docs/2.7.x/docs/middleware.html
userSchema.pre('save', function(next) {
    // TODO: add salt and hash the password using bcrypt, replace
    const user = this;

    bcrypt.genSalt()
        .then(function(salt) {
            logger.info(`salt ${salt} generated`);
            bcrypt.hash(user.password, salt)
                .then(function(hash) {
                    logger.info(`user password ${user.password} hashed to ${hash}`)
                    // user.salt = salt;
                    user.password = hash;
                    next();
                })
                .catch(function(err) {
                    next(new Error(`hashing error:\n ${err}`));
                });
        })
        .catch(function(err) {
            next(new Error(`salt error:\n ${err}`));
        });
});

module.exports = mongoose.model("User", userSchema);