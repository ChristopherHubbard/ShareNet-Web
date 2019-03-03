import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { history } from '../services';
import { userActions } from '../actions';

import { slide as CollapseMenu } from 'react-burger-menu';

// Import styles
import '../assets/Menu.scss';

// Import images
const burgerIcon: any = require('../assets/burger-menu-icon.png');
const deviceIcon: any = require('../assets/device-icon.svg');
const connectionIcon: any = require('../assets/device-connection-icon.png');
const logoutIcon: any = require('../assets/logout-icon.png');

interface MenuState
{
    showMenu: boolean
}

export class Menu extends React.Component<DispatchProp<any>, MenuState>
{
    public constructor(props: DispatchProp<any>)
    {
        super(props);

        this.state = {
            showMenu: false
        };

        this.onDevices = this.onDevices.bind(this);
        this.onConnectToNew = this.onConnectToNew.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    private onStateChange(state: any): void
    {
        this.setState({
            showMenu: state.isOpen
        });
    }

    private onDevices(event: any): void
    {
        history.push('/home/devices');

        this.setState({
            showMenu: false
        });
    }

    private onConnectToNew(event: any): void
    {
        history.push('/home/connect');

        this.setState({
            showMenu: false
        });
    }

    private onLogout(event: any): void
    {
        const { dispatch } = this.props;

        dispatch(userActions.logout());

        this.setState({
            showMenu: false
        });
    }

    public render(): React.ReactNode
    {
        const { showMenu } = this.state;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <CollapseMenu pageWrapId={"page-wrapper"}
                          outerContainerId={"outer-container"}
                          customBurgerIcon={<img className={"bm-burger-button"} src={burgerIcon}/>}
                          isOpen={showMenu}
                          onStateChange={(state) => this.onStateChange(state)}>
                <a className="menu-item" key="0" onClick={this.onDevices}>
                    <span>
                        <img src={deviceIcon}/>
                        <text>
                            Your Devices
                        </text>
                    </span>
                </a>
                <a className="menu-item" key="1" onClick={this.onConnectToNew}>
                    <span>
                        <img src={connectionIcon}/>
                        <text>
                            Connect
                        </text>
                    </span>
                </a>
                <a className="menu-item" key="2" onClick={this.onLogout}> 
                    <span>
                        <img src={logoutIcon}/>
                        <text>
                            Logout
                        </text>
                    </span>
                </a>
            </CollapseMenu>
        )
    }
}

function mapStateToProps(state: any): any
{
    return {

    };
}

// Connect store and set up redux form
export default connect<any>(
    mapStateToProps
)(Menu as any);