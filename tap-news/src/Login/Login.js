import React from 'react'

import LoginForm from './LoginForm'

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
        alert(JSON.stringify(this.state));

        // login logic
        const url = `http://${window.location.hostname}:3000`;
        const request = new Request(url, {
            method: 'POST',
            
        });

        fetch(request)
            .then(res => {
                if (res.status === 200) {

                } else {
                    
                }
            })

    }

    render() {
        return <LoginForm 
                    onChange={(e) => this.onChange(e)}
                    onSubmit={(e) => this.onSubmit(e)}
                    errors={this.state.errors}
                />
    }
}

export default Login;