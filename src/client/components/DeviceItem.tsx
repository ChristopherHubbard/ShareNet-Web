import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Device } from '../models';
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

        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.handleRemoveDevice = this.handleRemoveDevice.bind(this);
    }

    private onMouseLeave(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        // Set the selected state to false
        this.setState({
            selected: false
        });
    }

    private onMouseOver(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

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

        // If selected create the extra info -- code and link using url
        let el: JSX.Element = <div/>
        if (this.state.selected)
        {
            el = (<div>
                    <div> Connection Code: {device.code} </div>
                    <div> Contract URL: {device.contractURL} </div>
                    <div> Owner: {device.owner.email} </div>

                    <button onClick={this.handleRemoveDevice}> Remove Device </button>
                  </div>);
        }

        return (
            <li onMouseLeave={this.onMouseLeave} onMouseOver={this.onMouseOver} key={device.code}>
                {device.name}
                <div>
                    {el}
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