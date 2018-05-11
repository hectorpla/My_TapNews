import React from 'react';
import PropTypes from 'prop-types';

import './SignupForm.css'
import SignupForm from './SignupForm';
import { validateUser } from '../utils';

import { PORT } from '../globals';

class Signup extends React.Component {
    constructor(props, context) { // add context for route
        super(props, context);
        this.state = {
            email:"",
            password: "",
            confirm_password: "",
            errors: {}
        }
        console.log(this.context.router);
    }

    // TODO: found bug about input: what is shown != what is got
    // add tests
    onSubmit(e) {
        const email = this.state.email;
        const password = this.state.password;
        const errors = this.state.errors;

        // TODO: add validator for email
        try {
            validateUser({email, password});
        } catch(error) {
            console.log(error);
            errors.email = '' + error;
            return this.setState({errors});
        }

        // alert(JSON.stringify(this.state));

        // TODO: POST credential info to the server
        // const url = `https://${window.location.hostname}:${PORT}/auth/signup`;
        const url = `${window.location.origin}/auth/signup`;
        const request = new Request(url, {
            method: 'POST',
            headers: { // otherwise the server would not understand
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }) // should serialize it
        });

        fetch(request)
            .then(res => {
                // console.log(res);
                return res.json();
            })
            .then(res => {
                console.log('response of signup', res);
                if (res.error) {
                    // TODO: make message more user friendly
                    errors.auth = res.error;
                    return this.setState({errors});
                }
                this.setState({errors});
                console.log('successfully signed up!!!');
                alert('successfully signed up!!!')
                // TODO: redirect to login
                this.context.router.history.push('/login');
            })
            .catch(err => {
                console.log(err);
                errors.network = "Network Error";
                this.setState({errors});
            })
    }

    onChange(e) {
        // console.log(this.state);
        const which_field = e.target.name;

        if (which_field === 'email') {
            this.setState({ email: e.target.value })
            return;
        }
        // this.setState({[which]: e.target.value}); // problematic to setState twice
        const other_field = which_field === 'password' ? 
            'confirm_passowrd' : 'password';
        const new_val = e.target.value;

        const {errors} = this.state;
        if (new_val !== this.state[other_field]) {
            errors.password = "Password Mismatched!";
        } else {
            errors.password = "";
        }
        this.setState({
            errors: this.state.errors,
            [which_field]: new_val
        });
    }

    render() {
        // console.log(this.state);
        return (
            <SignupForm
                onSubmit={(e) => this.onSubmit(e)}
                onChange={(e)=>this.onChange(e)}
                errors={this.state.errors}
            />
        )
    }
}

Signup.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Signup;