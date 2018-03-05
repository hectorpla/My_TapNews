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

        // TODO: POST credential info to the server
    }

    onChange(e) {
        // console.log(this.state);
        const which_field = e.target.name;
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