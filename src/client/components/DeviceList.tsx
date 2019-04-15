import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { deviceActions, alertActions } from '../actions';
import { DeviceState as DeviceListProps, Device, User, AccessType, DeviceCategory } from '../models';
import { CustomInput } from './CustomInput';
import DeviceItem from './DeviceItem';
import DeviceItemAdminInner from './DeviceItemAdminInner';

import '../assets/Device.scss';

interface DeviceListState
{
    newDevice: Device,
    openNewDeviceDialog: boolean
}

export class DeviceList extends React.Component<DeviceListProps & DispatchProp<any>, DeviceListState>
{
    constructor(props: DeviceListProps & DispatchProp<any>)
    {
        super(props);
        
        // Logout the user if not already logged out
        const { dispatch } = this.props;

        let user: User = {
            email: ''
        };

        try
        {
            // Dispatch the event to get THIS user's devices
            if (localStorage.getItem('user'))
            {
                user = JSON.parse(localStorage.getItem('user') as string);
            }
            else
            {
                user = JSON.parse(sessionStorage.getItem('user') as string);
            }

            dispatch(deviceActions.get(user));
        }
        catch (error)
        {
            dispatch(alertActions.error('User not signed in'));
        }

        // Set initial state to empty object
        this.state = {
            newDevice: {
                name: '',
                owner: user,
                code: '',
                contractURL: '',
                accessType: AccessType.PUBLIC,
                deviceCategory: DeviceCategory.COMPUTE
            },
            openNewDeviceDialog: false
        };

        // Bind methods
        this.handleChange = this.handleChange.bind(this);
        this.handleOpenAddDevice = this.handleOpenAddDevice.bind(this);
        this.handleCloseAddDevice = this.handleCloseAddDevice.bind(this);
        this.handleAddDevice = this.handleAddDevice.bind(this);
    }

    private handleChange(event: any): void
    {
        event = event as React.ChangeEvent<HTMLInputElement>;
        const { name, value } = event.target;

        // Update state -- why does this method not work?
        this.setState((prevState) => ({
            ...prevState,
            newDevice: {
                ...prevState.newDevice,
                [name]: value
            }
        }));
    }

    private handleOpenAddDevice(): void
    {
        this.setState((prevState) => ({
            ...prevState,
            openNewDeviceDialog: true
        }));
    }

    private handleCloseAddDevice(): void
    {
        this.setState((prevState) => ({
            ...prevState,
            openNewDeviceDialog: false
        }));
    }

    private handleAddDevice(): void
    {
        // Handle the button event for adding a new device -- should open a form for the add device info
        const { dispatch } = this.props;

        // This is just a test device
        const { newDevice }  = this.state;

        dispatch(deviceActions.add(newDevice));

        // Close the dialog box and reset the new device state
        const user: User = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : JSON.parse(sessionStorage.getItem('user') as string);
        this.setState({
            newDevice: {
                name: '',
                owner: user,
                code: '',
                contractURL: '',
                accessType: AccessType.PRIVATE,
                deviceCategory: DeviceCategory.COMPUTE
            },
            openNewDeviceDialog: false
        });
    }

    public render(): React.ReactNode
    {
        const { devices} = this.props;

        const { openNewDeviceDialog } = this.state;

        const sortedDevices: Array<Device> = devices !== undefined ? devices.sort(((d1, d2) => d1.name > d2.name ? 1 : -1)) : new Array<Device>();

        return (
            <div>
                <span>
                    <h2> Your devices </h2>
                    {
                        !openNewDeviceDialog &&
                                <button className="deviceAdd" name="openAdd" onClick={this.handleOpenAddDevice}>+</button>
                    }
                </span>
                {
                    openNewDeviceDialog && 
                        (
                            <div>
                                <div>
                                    <label> Enter the device name </label>
                                    <input type="text" name="name" onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label> Enter the device code </label>
                                    <input type="text" name="code" onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label> Enter the contract URL </label>
                                    <input type="text" name="contractURL" onChange={this.handleChange}/>
                                </div>
                                <div>
                                    <label> Enter the access type </label>
                                    <select name="accessType" onChange={this.handleChange}>
                                        {
                                            Object.keys(AccessType).map((value, index) =>
                                                <option key={index} value={value}> 
                                                    {
                                                        value.toLowerCase().split('_').map(word =>
                                                        {
                                                            if (word !== 'and')
                                                            {
                                                                word = word.charAt(0).toUpperCase() + word.slice(1);
                                                            }
                                                            return word;
                                                        }).join(' ')
                                                    }
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label> Enter the category </label>
                                    <select name="deviceCategory" onChange={this.handleChange}>
                                        {
                                            Object.keys(DeviceCategory).map((value, index) =>
                                                <option key={index} value={value}> 
                                                    {
                                                        value.toLowerCase().split('_').map(word =>
                                                        {
                                                            if (word !== 'and')
                                                            {
                                                                word = word.charAt(0).toUpperCase() + word.slice(1);
                                                            }
                                                            return word;
                                                        }).join(' ')
                                                    }
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                                <button name="add" onClick={this.handleAddDevice}> Add </button>
                                <button name="cancelAdd" onClick={this.handleCloseAddDevice}> Cancel </button>
                            </div>
                        )
                }
                <div className="grid-container">
                    {
                        sortedDevices.length > 0 && sortedDevices.map((device) => <DeviceItem device={device} InnerComponent={DeviceItemAdminInner}/>)
                    }
                </div>
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