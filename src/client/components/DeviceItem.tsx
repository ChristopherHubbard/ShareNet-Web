import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Device, User } from '../models';
import { deviceActions } from '../actions';

const healthStatusIconOk: any = require('../assets/health-status-ok.png');
const healthStatusIconBad: any = require('../assets/health-status-bad.png');

interface DeviceItemInputProps
{
    device: Device,
    InnerComponent: any
}

interface  DeviceItemReduxProps
{
    health: boolean
}

interface DeviceItemState
{
    selected: boolean,
    updatedDevice: Device
}

// Not stateless -- should change on the click event
export class DeviceItem extends React.Component<DeviceItemInputProps & DeviceItemReduxProps & DispatchProp<any>, DeviceItemState>
{
    private interval: NodeJS.Timeout | null = null;

    public constructor(props: DeviceItemInputProps & DeviceItemReduxProps & DispatchProp<any>)
    {
        super(props);

        const { device } = this.props;

        // Set up the initial state
        this.state = {
            selected: false,
            updatedDevice: device
        };

        // Bind methods
        this.onBlur = this.onBlur.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    // Trigger the health check on each rerender
    public componentWillUnmount(): void
    {
        clearInterval(this.interval as NodeJS.Timeout);
    }

    public componentDidMount(): void
    {
        // Get the health for this device -- this can then be updated in the UI
        const { dispatch, device } = this.props;

        this.interval = setInterval(() =>
        {
            dispatch(deviceActions.getHealth(device));
        }, 5000);
    }

    private onBlur(event: React.FocusEvent<HTMLElement>): void
    {
        // Set the selected state to false
        const { currentTarget, relatedTarget } = event;

        setTimeout(() =>
        {
            console.log(currentTarget);
            console.log(relatedTarget);
            if (!relatedTarget || (relatedTarget instanceof Node && !currentTarget.contains(relatedTarget)))
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

    public render(): React.ReactNode
    {
        let { device, health, InnerComponent } = this.props;
        const { selected } = this.state;

        let healthIcon: any;
        if (!health)
        {
            health = false;
            healthIcon = healthStatusIconBad;
        }
        else
        {
            healthIcon = healthStatusIconOk;
        }

        let style: any;
        if (selected)
        {
            style = {
                width: '35rem',
                height: '30rem'
            };
        }
        else
        {
            style = {
                width: '30rem',
                height: '20rem'
            };
        }

        return (
            <div className={`card-${device.deviceCategory.toLowerCase().split(' ').join('')}`} style={style} tabIndex={-1} onBlur={this.onBlur} onClick={this.onClick} key={device.code}>
                <img src={healthIcon}/>
                <InnerComponent device={device} selected={selected}/>
            </div>
        );
    }
}

function mapStateToProps(state: any, ownProps: DeviceItemInputProps): DeviceItemInputProps & DeviceItemReduxProps
{
    const { healthStates } = state.devices;

    console.log(healthStates);
    console.log(healthStates.get(JSON.stringify(ownProps.device)));

    // Map only this device's health to the state
    return {
        device: ownProps.device,
        health: healthStates.get(JSON.stringify(ownProps.device as Device)),
        InnerComponent: ownProps.InnerComponent
    }
}

// Connect store and set up redux form
export default connect<DeviceItemReduxProps, {}, DeviceItemInputProps>(
    mapStateToProps
)(DeviceItem as any);