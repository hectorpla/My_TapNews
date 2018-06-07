import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function LoginForm({
    onSubmit,
    onChange,
    errors,
}) {
    return (
        <div className="sign-in-card row">
          <form className="col s12">
            <div className="row title"> Login </div>
            {/* TODO: authen message */ }
            { errors.auth && <div className="warning row"> {errors.auth} </div> }
            { errors.server && <div className="warning row"> {errors.server} </div> }
            { errors.network && <div className="warning row"> {errors.network} </div> }
            <div className="input-field row">
              <label htmlFor="email"> Email </label>
              <input id="email" type="text" name="email" className="validate" 
                onChange={onChange} />
            </div>
            <div className="input-field row">
              <label htmlFor="password"> Password </label>
              <input id="password" name="password" type="password" onChange={onChange} />
            </div>
            <div className="row">
              <a className="waves-effect btn float-right" onClick={onSubmit}> 
                login
              </a>
            </div>
            <div className="row">
              <p className="float-right"> 
                New here? <Link to="/signup"> Sign Up </Link> 
              </p>
            </div>
          </form>
        </div>
    );
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
}

export default LoginForm;
