import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from "redux";
import logger from "redux-logger"; //logs actions very nicely
import thunk from "redux-thunk";

import { fileReducers } from './reducers/fileReducers';
import { userReducers } from './reducers/userReducers';

let middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
    middleware = [...middleware, logger];
}
middleware = applyMiddleware(...middleware);
let reducers = combineReducers({
    file: fileReducers,
    user: userReducers
})

//TODO potentially preload state using cookies or browser storage
let preloadedState = {
    ...window.INITIAL_STATE,
}

const store = createStore(reducers, preloadedState, middleware )

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();




