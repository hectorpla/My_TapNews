// this file is not needed in the presence of main.js

import Base from './Base/Base';
import Login from './Login/Login';
import Signup from './Signup/Signup';


const routes = {
    component: Base,
    childrenRoutes: [
        {
            path: '/',
            
        },
        {
            path: '/signup',
            component: SignUp
        },
        {
            path: '/login',
            component: Login
        }
    ]
}

export default routes;