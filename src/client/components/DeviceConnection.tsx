import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { connectionActions } from '../actions';
import { DeviceConnectionState as DeviceConnectionProps, Device} from '../models';
import DeviceItem from './DeviceItem';
import DeviceItemPublicInner from './DeviceItemPublicInner';
import DeviceItemPrivateInner from './DeviceItemPrivateInner';

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
    }

    public componentWillMount(): void
    {
        const { dispatch } = this.props;

        dispatch(connectionActions.getPublic());
    }

    // // On unmount try to search for code '' ?
    // public componentWillUnmount(): void
    // {
    //     const { dispatch } = this.props;

    //     // Bit of a hack -- should probably just have an unload action in connection reducer
    //     dispatch(connectionActions.get(''));
    // }

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

    public render(): React.ReactNode
    {
        const { connecting, connected, searchedDevice, publicDevices } = this.props;

        return (
            <div>
                <div className="pageHeaderContainer">
                    <h1 className="pageHeaderLeft"> Connect </h1>
                </div>
                <hr className="pageBreak"/>
                <div className="pageHeaderContainer">
                    <h2 className="headerAlignLeft" style={{display: 'inline-block', paddingRight: '3rem'}}> Private </h2>
                    <input onChange={this.onCodeChange} name="code"/>
                        {
                            !connecting &&
                                <div style={{display: 'inline-block'}}>
                                    <button onClick={this.onSearch}> Search for device </button>
                                </div>
                        }
                </div>
                <div className="grid-container">
                    {
                        connected && searchedDevice &&
                            <DeviceItem device={searchedDevice} InnerComponent={DeviceItemPrivateInner}/>
                    }
                </div>
                <hr className="pageBreak"/>
                <div className="pageHeaderContainer">
                    <h2 className="headerAlignLeft"> Public </h2>
                    <div className="grid-container">
                        {
                            publicDevices && publicDevices.length > 0 &&
                            publicDevices.map((device: Device) => 
                                <DeviceItem device={device} InnerComponent={DeviceItemPublicInner}/>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: any): DeviceConnectionProps
{
    const { connected, connecting, searchedDevice, connectedDevice, publicDevices } = state.connection;
    return {
        connected,
        connecting,
        searchedDevice,
        connectedDevice,
        publicDevices
    };
}

// Connect store and set up redux form
export default connect<DeviceConnectionProps>(
    mapStateToProps
)(DeviceConnection as any);