import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Base from './Base/Base';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import NavBar from './NavBar/NavBar';

const AboutUs = () => (
    <div className="container center">
        contact us by ...
    </div>
)

const Main = () => (
    <main>
        <NavBar />
        <Switch>
            <Route exact path='/' component={Base} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/about-us' component={AboutUs} />
        </Switch>
    </main>
)

export default Main;