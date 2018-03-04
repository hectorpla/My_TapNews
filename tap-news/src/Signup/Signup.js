import React from 'react';

import './SignupForm.css'
import SignupForm from './SignupForm';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:"",
            password: "",
            confirm_password: "",
            errors: {}
        }
    }

    onSubmit(e) {
        alert(JSON.stringify(this.state));
    }

    onChange(e) {
        // console.log(this.state);
        const which = e.target.name;
        this.setState({[which]: e.target.value});

        // weird behavior: error delayed, 
        // {password: 'a', confirm_password: ''} => no error
        // {password: 'a', confirm_password: 'a'} => error

        const {errors} = this.state;
        if (this.state.password !== this.state.confirm_password) {
            errors.password = "Password Mismatched!";
        } else {
            errors.password = "";
        }
        this.setState({errors: this.state.errors});
    }

    render() {
        console.log(this.state);
        return (
            <SignupForm
                onSubmit={(e) => this.onSubmit(e)}
                onChange={(e)=>this.onChange(e)}
                errors={this.state.errors}
                use={{}}
            />
        )
    }
}

export default Signup;