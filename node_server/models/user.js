const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const logger = require('../utils/logger');

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

userSchema.methods.comparePassword = function(password) {
    // don't handle error here
    return bcrypt.compare(password, this.password);
};


// ERROR HANDLING: http://mongoosejs.com/docs/2.7.x/docs/middleware.html
// TODO: test the pre-save function in integration test
userSchema.pre('save', function(next) {
    // TODO: add salt and hash the password using bcrypt, replace
    const user = this;

    bcrypt.genSalt()
        .then(function(salt) {
            logger.silly(`salt ${salt} generated`);
            bcrypt.hash(user.password, salt)
                .then(function(hash) {
                    logger.silly(`user password ${user.password} hashed to ${hash}`)
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