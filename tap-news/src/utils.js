import validator from 'validator';

function validateUser(user) {
    console.log("validate", user);
    if (!validator.isEmail(user.email)) {
        throw Error('Not a email');
    }

    if (user.password.length === 0) {
        throw Error('Password is empty');
    }

    if (user.password.length > 12) {
        throw Error('Password too long');
    }
    // console.log('info checked');
}

export {
    validateUser
}