class Auth {
    static Authenticate(email, token) {
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
    }

    static isAuthenticated() {
        // TODO: check if the token and email is in the local storage
        // console.log('isAuthenticated', localStorage.getItem('email'));
        return localStorage.getItem('email') !== null
            && localStorage.getItem('token') !== null;
    }

    static deAuthenticate() {
        localStorage.removeItem('email');
        localStorage.removeItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }
    
    static getEmail() {
        return localStorage.getItem('email');
    }

}

export default Auth;