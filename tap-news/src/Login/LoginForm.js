import React from 'react'
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
            <div className="input-field row">
              <label for="email" />
              <input id="email" type="text" name="email" className="validate" placeholder="email" 
                onChange={onChange} />
            </div>
            <div className="input-field row">
              <label for="password" />
              <input id="password" name="password" type="password" onChange={onChange} />
            </div>
            <div className="row">
              <a className="waves-effect btn float-right" onClick={onSubmit}> 
                login
              </a>
            </div>
            <div className="row">
              <p className="float-right"> 
                New here? <a href="#" > Sign Up </a> 
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
