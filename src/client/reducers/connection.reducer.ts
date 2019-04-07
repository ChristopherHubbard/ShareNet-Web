import { connectionConstants } from '../constants';
import { DeviceConnectionState, IAction, AccessType, DeviceCategory } from '../models';

const initState: DeviceConnectionState = {
    connected: false,
    connecting: false,
    searchedDevice: {
        code: '',
        contractURL: '',
        name: '',
        accessType: AccessType.PRIVATE,
        deviceCategory: DeviceCategory.COMPUTE
    },
    connectedDevice: {
        code: '',
        contractURL: '',
        name: '',
        accessType: AccessType.PRIVATE,
        deviceCategory: DeviceCategory.COMPUTE
    }
};

export function connection(state: DeviceConnectionState = initState, action: IAction): DeviceConnectionState
{
    switch (action.type)
    {
        case connectionConstants.GET_CONNECTION_REQUEST:
            return <DeviceConnectionState> {
                connecting: true,
                connectedDevice: initState.connectedDevice
            };
        case connectionConstants.GET_CONNECTION_SUCCESS:
            return <DeviceConnectionState> {
                connected: true,
                connecting: false,
                searchedDevice: action.searchedDevice
            };
        case connectionConstants.GET_CONNECTION_ERROR:
            return <DeviceConnectionState> {
                connected: false,
                connecting: false
            };
        case connectionConstants.CONNECT_SUCCESS:
            return <DeviceConnectionState> {
                connected: true,
                connecting: false,
                connectedDevice: action.device
            }
        default:
            return state;
    }
}