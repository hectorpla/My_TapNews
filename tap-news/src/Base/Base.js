import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../Auth/Auth';
import App from '../App/App'

// import './Base.css'

class Base extends React.Component {
    render() {
        return (
            <div>
                <nav className="nav-bar indigo">
                     <div className="nav-wrapper" >
                         <a href="/" className="nav-logo" > My Tap News </a>
                         <ul className="right">
                            {
                                Auth.isAuthenticated() ? 
                                <span> 
                                    {/* TODO: log-in info */}
                                    <li> Hello, {Auth.getEmail()} </li>
                                    <li> 
                                        <Link to="/login" onClick={Auth.deAuthenticate}> 
                                            login 
                                        </Link>
                                    </li>
                                 </span>
                                :
                                <span>
                                    <li> <Link to="/login"> login </Link> </li>
                                    <li> <Link to="/signup"> signup </Link> </li>
                                </span>
                            }
                         </ul>
                     </div>
                </nav>
                <App />
            </div>
        )
    }
}

export default Base;