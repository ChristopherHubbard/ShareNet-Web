import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { history } from '../services';
import { userActions } from '../actions';

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

        this.onShowMenu = this.onShowMenu.bind(this);
        this.onCloseMenu = this.onCloseMenu.bind(this);
        this.onDevices = this.onDevices.bind(this);
        this.onConnectToNew = this.onConnectToNew.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    private onShowMenu(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        const { showMenu } = this.state; 
        
        this.setState({
            showMenu: !showMenu
        });
    }

    private onCloseMenu(event: React.FocusEvent<HTMLElement>): void
    {
        var currentTarget = event.currentTarget;

        setTimeout(() => 
        {
            if (!currentTarget.contains(document.activeElement))
            {
                this.setState({
                    showMenu: false
                });
            }
        }, 0);
    }

    private onDevices(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        history.push('/home/devices');
    }

    private onConnectToNew(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        history.push('/home/connect');
    }

    private onLogout(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        const { dispatch } = this.props;

        dispatch(userActions.logout());
    }

    public render(): React.ReactNode
    {
        const { showMenu } = this.state;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div onBlur={this.onCloseMenu} tabIndex={0}>
                <button onClick={this.onShowMenu}> Menu </button>
                
                {showMenu && <div className="menu">
                                <div>
                                    <button onClick={this.onDevices}> My Devices </button>
                                </div>
                                <div>
                                    <button onClick={this.onConnectToNew}> Connect to New Device </button>
                                </div>
                                <div>
                                    <button onClick={this.onLogout}> Logout </button>
                                </div>
                            </div>}
            </div>
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