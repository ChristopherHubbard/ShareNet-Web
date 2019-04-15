import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Device, User } from '../models';
import { deviceActions } from '../actions';

interface DeviceItemPublicInnerProps
{
    device: Device,
    selected: boolean
}

interface DeviceItemState
{
    updatedDevice: Device
}

// Not stateless -- should change on the click event
export class DeviceItemPublicInner extends React.Component<DeviceItemPublicInnerProps & DispatchProp<any>, DeviceItemState>
{

    public constructor(props: DeviceItemPublicInnerProps & DispatchProp<any>)
    {
        super(props);

        const { device } = this.props;

        // Set up the initial state
        this.state = {
            updatedDevice: device
        };
    }

    public render(): React.ReactNode
    {
        let { device, selected } = this.props;

        return (
            <div className="content" style={{ display: 'inline-block' }}>
                <h3> {device.name} </h3>
                <h5> {device.deviceCategory} </h5>
                {
                    selected && (
                        <div>
                            <div> Access Type: {device.accessType} </div>
                            <div> Connection Code: {device.code} </div>

                            <div style={{ display: 'inline-block' }}>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

function mapStateToProps(state: any, ownProps: DeviceItemPublicInnerProps): DeviceItemPublicInnerProps
{
    // Map only this device's health to the state
    return {
        device: ownProps.device,
        selected: ownProps.selected
    }
}

// Connect store and set up redux form
export default connect<{}, {}, DeviceItemPublicInnerProps>(
    mapStateToProps
)(DeviceItemPublicInner as any);