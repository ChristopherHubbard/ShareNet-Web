import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { reducer as form } from 'redux-form';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

// Import Styles?
import './styles/test.scss';

// Combine the reducers into a top level reducer
const rootReducer = combineReducers({
    form: form
});

// Create the store using the combined reducers
const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

// Render the top level app component -- provide the store
render(
    <Provider store={store}>
        <h1 className="App"> It worked! </h1>
    </Provider>,
    document.getElementById('app')
);