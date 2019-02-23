import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { connectionActions } from '../actions';
import { DeviceConnectionState as DeviceConnectionProps } from '../models';
import { history } from '../services';

interface DeviceState
{
    code: string
}

export class DeviceConnection extends React.Component<DeviceConnectionProps & DispatchProp<any>, DeviceState>
{
    public constructor(props: DeviceConnectionProps & DispatchProp<any>)
    {
        super(props);

        this.state = {
            code: ''
        };

        this.onCodeChange = this.onCodeChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onConnect = this.onConnect.bind(this);
    }

    private onCodeChange(event: any): void
    {
        event = event as React.ChangeEvent<HTMLInputElement>;
        const { name, value } = event.target;

        // Update state -- why does this method not work?
        this.setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    private onSearch(event: React.MouseEvent<HTMLElement>): void
    {
        const { dispatch } = this.props;
        const { code } = this.state;
        dispatch(connectionActions.get(code));
    }

    private onConnect(event: React.MouseEvent<HTMLElement>): void
    {
        // Connect to the searched device
        const { dispatch, searchedDevice } = this.props;
        dispatch(connectionActions.connect(searchedDevice));

        // Forward to the order page
        history.push('/order');
    }

    public render(): React.ReactNode
    {
        const { connecting, connected, searchedDevice } = this.props;

        return (
            <div>
                <h2> Use a smart device! </h2>
                <h3> Enter a connection code </h3>
                <input onChange={this.onCodeChange} name="code"/>
                {
                    !connecting &&
                        <div>
                            <button onClick={this.onSearch}> Search for device </button>
                        </div>
                }
                {
                    connected && searchedDevice &&
                        <div>
                            <div> Device Name: {searchedDevice.name} </div>
                            <div> Connection Code: {searchedDevice.code} </div>
                            <button onClick={this.onConnect}> Connect </button>
                        </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state: any): DeviceConnectionProps
{
    const { connected, connecting, searchedDevice, connectedDevice } = state.connection;
    return {
        connected,
        connecting,
        searchedDevice,
        connectedDevice
    };
}

// Connect store and set up redux form
export default connect<DeviceConnectionProps>(
    mapStateToProps
)(DeviceConnection as any);