const isEmail = require('validator/lib/isEmail');

const logger = require('../utils/logger');

function validateUserInfo(user) {
    if (!user.email || !user.password) {
        return { 
            error: 'client side should specify email and password',
            code: 100 
        }; // temparary code
    }
    if (!isEmail(user.email)) {
        return {
            error: 'not a email',
            code: 102
        };
    }
    return null;
}

module.exports = function(req, res, next) {
    const body = req.body;
    logger.info('sign up validator:', body);
    var validateError = validateUserInfo(body);
    if (validateError) {
        res.status(400).json(validateError);
        return;
    }
    next();
}