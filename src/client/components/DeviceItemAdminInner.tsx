import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Device, User, AccessType } from '../models';
import { deviceActions } from '../actions';

interface DeviceItemAdminInnerProps
{
    device: Device,
    selected: boolean
}

interface DeviceItemState
{
    updating: boolean,
    updatedDevice: Device,
    password: string
}

// Not stateless -- should change on the click event
export class DeviceItemAdminInner extends React.Component<DeviceItemAdminInnerProps & DispatchProp<any>, DeviceItemState>
{
    public constructor(props: DeviceItemAdminInnerProps & DispatchProp<any>)
    {
        super(props);

        const { device } = this.props;

        // Set up the initial state
        this.state = {
            updating: false,
            updatedDevice: device,
            password: ''
        };

        // Bind methods
        this.handleUpdateDevice = this.handleUpdateDevice.bind(this);
        this.handleRemoveDevice = this.handleRemoveDevice.bind(this);
        this.onUpdateDeviceChange = this.onUpdateDeviceChange.bind(this);
    }

    private handleUpdateDevice(event: React.MouseEvent<HTMLElement>): void
    {
        // Prevent default actions?
        event.preventDefault();

        // This should be called with the device state?
        const { dispatch } = this.props;
        const { updatedDevice, password } = this.state;

        dispatch(deviceActions.updateDevice(updatedDevice, password));
    }

    private handleRemoveDevice(): void
    {
        // Handle the remove event for a device
        const { dispatch, device } = this.props;

        dispatch(deviceActions.remove(device));
    }

    private onUpdateDeviceChange(event: any): void
    {
        const { device } = this.props;
        const { updatedDevice } = this.state;
        const { name, value } = event.target;

        // Check for equality with original
        if (JSON.stringify(updatedDevice) !== JSON.stringify(device))
        {
            this.setState((prevState) => ({
                ...prevState,
                updating: true,
                updatedDevice: {
                    ...updatedDevice,
                    [name]: value
                }
            }));
        }
        else if (name !== 'password')
        {
            this.setState((prevState) => ({
                ...prevState,
                updating: false,
                updatedDevice: {
                    ...updatedDevice,
                    [name]: value
                }
            }));
        }
        else
        {
            this.setState((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    public componentWillReceiveProps(nextProps: DeviceItemAdminInnerProps): void
    {
        const { selected, device } = nextProps;

        if (!selected)
        {
            // The device update dialog needs to be closed
            this.setState((prevState) => ({
                ...prevState,
                updatedDevice: device,
                updating: false,
                password: ''
            }));
        }
    }

    public render(): React.ReactNode
    {
        const { device, selected } = this.props;
        const { updating } = this.state;

        return (
            <div className="content" style={{ display: 'inline-block' }}>
                <h3> {device.name} </h3>
                <h5> {device.deviceCategory} </h5>
                {
                    selected && (
                        <div>
                            <div>
                                Connection Code: {device.code}
                            </div>
                            <div>
                                <div style={{paddingRight: '4px', display: 'inline-block'}}>
                                    Access Type:
                                </div>
                                <select name="accessType" onChange={this.onUpdateDeviceChange} defaultValue={device.accessType}>
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
                                Contract URL: <input className="deviceInput" onChange={this.onUpdateDeviceChange} name="contractURL" defaultValue={device.contractURL}/>
                            </div>
                            <div> 
                                Setup Password: <input className="deviceInput" onChange={this.onUpdateDeviceChange} name="password" type="password"/>
                            </div>

                            <div style={{ display: 'inline-block' }}>
                                <div>
                                    <button onClick={this.handleUpdateDevice} disabled={!updating}> Update Device </button>
                                    <button onClick={this.handleRemoveDevice} disabled={updating}> Remove Device </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

function mapStateToProps(state: any, ownProps: DeviceItemAdminInnerProps): DeviceItemAdminInnerProps
{
    // Map only this device's health to the state
    return {
        device: ownProps.device,
        selected: ownProps.selected
    }
}

// Connect store and set up redux form
export default connect<{}, {}, DeviceItemAdminInnerProps>(
    mapStateToProps
)(DeviceItemAdminInner as any);