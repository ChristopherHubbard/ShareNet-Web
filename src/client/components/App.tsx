import * as React from 'react';
import { Router, Route, HashRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import { PrivateRoute } from './PrivateRoute';
import { history } from '../services';
import DeviceList from './DeviceList';
import DeviceConnection from './DeviceConnection';
import OrderPage from './OrderPage';

export class App extends React.Component<{}, {}>
{
    constructor(props: any)
    {
        super(props);
    }

    public render(): React.ReactNode
    {
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={HomePage}/>
                                <Route path="/login" component={LoginPage}/>
                                <Route path="/register" component={RegisterPage}/>
                                <PrivateRoute exact path="/devices" component={DeviceList}/>
                                <PrivateRoute exact path="/connect" component={DeviceConnection}/>
                                <PrivateRoute exact path="/order" component={OrderPage}/>
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}