class Auth {
    static Authenticate(email, token) {
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
    }

    static isAuthenticated() {
        // TODO: check if the token and email is in the local storage
        return localStorage.getItem('token') !== undefined
            && localStorage.getItem('token') !== undefined;
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