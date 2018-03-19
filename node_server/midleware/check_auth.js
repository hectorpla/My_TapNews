// middleware for authentication
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');
const tokenSecret = require('../config/config').tokenSecret;

const logger = require('../utils/logger');

// TODO: add expire checking
module.exports = function authenticate_with_token(req, res, next) {
    const token = req.body.token;
    jwt.verify(token, tokenSecret, function(err, decoded) {
        if (err) {
            res.status(401).json({
                error: 'failed to authenticate token',
                code: 121
            });
            return;
        }
        logger.verbose('user pay load', decoded);
        UserModel.findOne({ _id: decoded.id }, function(err, user) {
            if (err) {
                logger.error(err);
                res.status(500).json({
                    error: "unknown error",
                    code: 1000
                })
                return;
            }
            logger.debug(`(user info) ${req.body.email} ?= ${user && user.email} (database info)`);
            if (!user || user.email !== req.body.email) { // deleted account or mismatch
                res.status(401).json({
                    error: "wrong user",
                    code: 122
                })
                return;
            }
            next();
        })
    })
}