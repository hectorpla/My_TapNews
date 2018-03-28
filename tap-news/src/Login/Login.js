import React from 'react';
import PropTypes from 'prop-types';

import LoginForm from './LoginForm';
import Auth from '../Auth/Auth';

// check if an object is empty
// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {}
        }
    }

    onChange(e) {
        console.log('Login: onChange');
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        console.log('Login: onSubmit');
        // alert(JSON.stringify(this.state));

        // TODO: add validator for email

        // login logic
        const url = `http://${window.location.hostname}:3000/auth/login`;
        const request = new Request(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        });

        let errors = this.state.errors; 
        // TODO: figure out serial then and catch

        // If you chain mutliple .then, you should always add a return
        // at the end of their respective callbalcks. Else they will execute
        // at the same time

        // with a chain on .then if an error happens on the first one, it will
        // skip sebsequent .then until it finds a .catch
        fetch(request)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    errors = {}
                } else if (res.status < 400) {
                    // unexpected
                    return null;
                } else if (res.status === 401) {
                    console.log('user unauthenticated!!!');
                    errors.auth = null;
                    Auth.deAuthenticate();
                } else if (res.status < 500) {
                    // unexpected
                    return null;
                } else {
                    errors.server = null;
                }
                return res.json();
            })
            .then(res => {
                console.log(res, errors);
                if (!res) { 
                    errors.server = 'unexpected error (temporary error category)'
                    this.setState({errors});
                    return;
                }
                if (!isEmpty(errors)) {
                    if (errors.auth !== undefined) {
                        errors.auth = res.error;
                    }
                    if (errors.server !== undefined) {
                        errors.server = res.error;
                    }
                    this.setState({errors}); 
                    return;
                }
                Auth.Authenticate(this.state.email, res.token);
                this.setState({errors:{}})
                // TODO: redirect to news page
                this.context.router.history.replace('/')
            })
            .catch(err => { // might not neccessary network error
                errors.network = 'Network Error';
                this.setState({errors});
            });
    }

    render() {
        return <LoginForm 
                    onChange={(e) => this.onChange(e)}
                    onSubmit={(e) => this.onSubmit(e)}
                    errors={this.state.errors}
                />
    }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Login;