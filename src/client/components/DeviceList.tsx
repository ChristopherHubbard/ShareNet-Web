import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { reduxForm, Field, Form, isPristine, InjectedFormProps } from 'redux-form';
import { deviceActions, alertActions } from '../actions';
import { DeviceState as DeviceListProps, Device, User } from '../models';
import { CustomInput } from './CustomInput';
import DeviceItem from './DeviceItem';

interface DeviceListState
{
    newDevice: Device | undefined
}

class DeviceList extends React.Component<DeviceListProps & DispatchProp<any> & InjectedFormProps, DeviceListState>
{
    constructor(props: DeviceListProps & DispatchProp<any> & InjectedFormProps)
    {
        super(props);
        
        // Logout the user if not already logged out
        const { dispatch } = this.props;

        try
        {
            // Dispatch the event to get THIS user's devices
            const user: User = JSON.parse(localStorage.getItem('user') as string);
            dispatch(deviceActions.get(user));
        }
        catch (error)
        {
            dispatch(alertActions.error('User not signed in'));
        }

        this.state = {
            newDevice: undefined
        };

        // Bind methods
        this.handleAddDevice = this.handleAddDevice.bind(this);
    }

    private handleAddDevice(): void
    {
        // Handle the button event for adding a new device -- should open a form for the add device info
        const { dispatch } = this.props;

        // This is just a test device
        const device: Device = {
            name: 'Bar',
            owner: JSON.parse(localStorage.getItem('user') as string),
            code: '1234',
            contractURL: ''
        };
        this.setState({
            newDevice: device
        });

        // const device: Device = this.state.newDevice as Device;

        dispatch(deviceActions.add(device))
    }

    public render(): React.ReactNode
    {
        const { devices } = this.props;

        // Setup the device items

        return (
            <div>
                Your devices
                <button onClick={this.handleAddDevice}> Add Device </button>
                <ul>
                    {devices && devices.map((device: Device) => <DeviceItem device={device}/>)}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state: any): DeviceListProps
{
    const { devices } = state.devices;
    return {
        devices
    };
}

// Connect store and set up redux form
export default connect<DeviceListProps>(
    mapStateToProps
)(DeviceList as any);