import React from 'react';
import PropTypes from 'prop-types';

import LoginForm from './LoginForm';
import Auth from '../Auth/Auth';


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

        fetch(request)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    return res.json();
                } else {
                    const errors = this.state.errors;
                    errors.auth = res.error;
                    this.setState({ errors });
                    Auth.deAuthenticate();
                }
            })
            .then(res => {
                console.log(res);
                Auth.Authenticate(this.state.email, res.token);
                this.setState({errors:{}})
                // TODO: redirect to news page
                this.context.router.history.replace('/')
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