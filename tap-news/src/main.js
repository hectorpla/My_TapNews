import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Base from './Base/Base';
import Login from './Login/Login';
import Signup from './Signup/Signup';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Base} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
        </Switch>
    </main>
)

export default Main;