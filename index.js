import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reducers from "./Redux/Reducers";
import App from './App';



//const store = createStore(reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducers, composeEnhancers())


ReactDOM.render(

    <Provider store={store}>
        <BrowserRouter basename="/PAMS">
            <App />
        </BrowserRouter>
    </Provider>,

    document.getElementById('root')
);
