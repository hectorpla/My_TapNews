// middleware for authentication
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');
const tokenSecret = require('../config/config').tokenSecret;

const logger = require('../utils/logger');

// TODO: add expire checking
module.exports = function authenticate_with_token(req, res, next) {
    // should take care of the authorization
    const authInfo = req.get('Authorization')
    logger.debug(authInfo)
    if (authInfo === undefined || !authInfo.startsWith('Bearer')) {
        logger.info("Bearer not specified")
        res.status(401).json({
            error: 'Bearer not specified',
            code: 120
        });
        return;
    }
    const token = authInfo.split(' ')[1];
    logger.debug(`got token: ${token}`)
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
            
            if (!user) { // deleted account
                res.status(401).json({
                    error: "user does not exist",
                    code: 122
                })
                return;
            }
            logger.debug('authenticatipn passed')
            next();
        })
    })
}