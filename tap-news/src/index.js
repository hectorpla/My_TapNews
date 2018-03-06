import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

// import App from './App/App';
import Main from './main'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
    <BrowserRouter>
        <Main />
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
