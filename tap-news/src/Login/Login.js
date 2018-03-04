import React from 'react'

import loginForm from './LoginForm'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {}
        }
    }

    onChange(e) {
        console.log('Login: onChange');

    }

    onSubmit(e) {
        console.log('Login: onSubmit');
    }

    render() {
        return loginForm((e) => this.onChange(),
                         (e) => this.onSubmit(),
                         {});
    }
}

export default Login;