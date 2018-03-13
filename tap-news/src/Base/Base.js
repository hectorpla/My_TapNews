import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../Auth/Auth';
import App from '../App/App'
import NavBar from '../NavBar/NavBar';

// import './Base.css'

class Base extends React.Component {
    render() {
        return (
            <div>
                <App />
                {/* other components */}
            </div>
        )
    }
}

export default Base;