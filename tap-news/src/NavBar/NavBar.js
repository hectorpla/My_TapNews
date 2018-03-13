import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../Auth/Auth';


const NavBar = () => (
    <div>
        <nav className="nav-bar indigo">
            <div className="nav-wrapper" >
                <a href="/" className="nav-logo" > My Tap News </a>
                <ul className="right">
                <li> <Link to="/about-us"> about us </Link> </li>
                {   
                    Auth.isAuthenticated() ? 
                    <span> 
                        <li> Hello, {Auth.getEmail()} </li>
                        <li> 
                            <Link to="/login" onClick={Auth.deAuthenticate}> 
                                logout 
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
    </div>
)

export default NavBar;