import React from 'react'
import PropTypes from 'prop-types';

function SignupForm({
    onSubmit,
    onChange,
    errors,
    user
}) {
    console.log(errors);
    return (
        <div className="sign-in-card row">
          <form className="col s12">
            <div className="row title"> Sign Up </div>
            <div className="input-field row">
              <label for="email" />
              <input id="email" type="text" className="validate" name="email" placeholder="email" />
            </div>
            <div className="input-field row">
              <label for="password"> Password </label>
              <input id="password" type="password" name="password" onChange={onChange} />
            </div>
            { errors.password && <div className="warning row"> {errors.password} </div> }
            <div className="input-field row">
              <label for="confirm_password"> Confirm Password </label>
              <input id="confirm_password" name="confirm_password" type="password" onChange={onChange} />
            </div>
            <div className="row">
              <a className="waves-effect btn float-right" onClick={onSubmit}> 
                Sign Up 
              </a>
            </div>
          </form>
        </div>
    );
}

SignupForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
}

export default SignupForm;