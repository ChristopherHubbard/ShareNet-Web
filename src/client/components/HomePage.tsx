import * as React from 'react';
import { Router, Route } from 'react-router-dom';
import { history } from '../services';
import { PrivateRoute } from './PrivateRoute';
import Menu from './Menu';
import DeviceList from './DeviceList';
import DeviceConnection from './DeviceConnection';
import OrderPage from './OrderPage';

export default class HomePage extends React.Component<{}, {}>
{
    public constructor(props: any)
    {
        super(props);
    }

    public render(): React.ReactNode
    {
        // Extract prop data
        const { } = this.props;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div>
                <div>
                    <Menu/>
                </div>
                <div>
                    <h1> Smart Bar prototype </h1>
                </div>
                <Router history={history}>
                    <div>
                        <PrivateRoute path="/home/devices" component={DeviceList}/>
                        <PrivateRoute path="/home/connect" component={DeviceConnection}/>
                        <PrivateRoute path="/home/order" component={OrderPage}/>
                    </div>
                </Router>
            </div>
        )
    }
}