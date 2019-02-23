import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Device, User } from '../models';
import { deviceActions } from '../actions';

interface DeviceItemProps
{
    device: Device
}

interface DeviceItemState
{
    selected: boolean
}

// Not stateless -- should change on the click event
export class DeviceItem extends React.Component<DeviceItemProps & DispatchProp<any>, DeviceItemState>
{
    public constructor(props: DeviceItemProps & DispatchProp<any>)
    {
        super(props);

        // Set up the initial state
        this.state = {
            selected: false
        };

        this.onBlur = this.onBlur.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleRemoveDevice = this.handleRemoveDevice.bind(this);
    }

    private onBlur(event: React.FocusEvent<HTMLElement>): void
    {
        // Set the selected state to false
        var currentTarget = event.currentTarget;

        setTimeout(() => 
        {
            if (!currentTarget.contains(document.activeElement))
            {
                this.setState({
                    selected: false
                });
            }
        }, 0);
    }

    private onClick(event: React.MouseEvent<HTMLElement>): void
    {
        // Set the selected state to true
        this.setState({
            selected: true
        });
    }

    private handleRemoveDevice(): void
    {
        // Handle the remove event for a device
        const { dispatch, device } = this.props;

        dispatch(deviceActions.remove(device));
    }

    public render(): React.ReactNode
    {
        const { device } = this.props;
        const { selected } = this.state;

        return (
            <li tabIndex={-1} onBlur={this.onBlur} onClick={this.onClick} key={device.code}>
                <h3> {device.name} </h3>
                <div>
                    {selected && (<div>
                                    <div> Device Name: {device.name} </div>
                                    <div> Connection Code: {device.code} </div>
                                    <div> Contract URL: {device.contractURL} </div>

                                    <button onClick={this.handleRemoveDevice}> Remove Device </button>
                                  </div>)}
                </div>
            </li>
        )
    }
}

function mapStateToProps(state: any, ownProps: DeviceItemProps): DeviceItemProps
{
    return {
        device: ownProps.device
    }
}

// Connect store and set up redux form
export default connect<{}, {}, DeviceItemProps>(
    mapStateToProps
)(DeviceItem as any);