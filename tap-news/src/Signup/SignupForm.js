import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function SignupForm({
    onSubmit,
    onChange,
    errors,
}) {
    console.log(errors);
    return (
        <div className="sign-in-card row">
          <form className="col s12">
            <div className="row title"> Sign Up </div>
            <div className="input-field row">
              <label for="email" />
              <input id="email" type="text" className="validate" name="email" placeholder="email" 
                onChange={onChange}
              />
            </div>
            { errors.email && <div className="warning row"> {errors.email} </div> }
            <div className="input-field row">
              <label for="password"> Password </label>
              <input id="password" type="password" name="password" onChange={onChange} />
            </div>
            { errors.password && <div className="warning row"> {errors.password} </div> }
            <div className="input-field row">
              <label for="confirm_password"> Confirm Password </label>
              <input id="confirm_password" name="confirm_password" type="password" onChange={onChange} />
            </div>
            { errors.auth && <div className="warning row"> Server: {errors.auth} </div> }
            { errors.network && <div className="warning row"> {errors.network} </div> }
            <div className="row">
              {/* TODO: disable button if form is invalid */}
              <a className="waves-effect btn float-right" onClick={onSubmit}> 
                Sign Up 
              </a>
            </div>
            <div className="row">
              <p className="float-right"> 
                have an acount? <Link to="/login"> log in </Link> 
              </p>
            </div>
          </form>
        </div>
    );
}

SignupForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
}

export default SignupForm;