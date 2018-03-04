import React from 'react'
import PropTypes from 'prop-types';

function loginForm({
    onSubmit,
    onChange,
    user,
}) {
    return (
        <div className="sign-in-card row">
          <form className="col s12">
            <div className="row title"> Login </div>
            <div className="input-field row">
              <label for="email" />
              <input id="email" type="text" className="validate" placeholder="email" />
            </div>
            <div className="input-field row">
              <label for="password" />
              <input id="password" type="password" />
            </div>
            <div className="row">
              <a className="waves-effect btn float-right"> login </a>
            </div>
            <div className="row">
              <p className="float-right"> 
                New here? <a href="#"> Sign Up </a> 
              </p>
            </div>
          </form>
        </div>
    );
}

loginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
}

export default loginForm;
