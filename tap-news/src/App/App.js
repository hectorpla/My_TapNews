import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.js';

import './App.css';

import React from 'react';

import NewsPanel from '../NewsPanel/NewsPanel';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

class App extends React.Component{
    render() {
        return (
            <div className="container">
                <NewsPanel />
            </div>
        )
    }
}

export default App;