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
    },
    publicDevices: []
};

export function connection(state: DeviceConnectionState = initState, action: IAction): DeviceConnectionState
{
    switch (action.type)
    {
        case connectionConstants.GET_CONNECTION_REQUEST:
            return <DeviceConnectionState> {
                ...state,
                connecting: true,
                connectedDevice: initState.connectedDevice
            };
        case connectionConstants.GET_CONNECTION_SUCCESS:
            return <DeviceConnectionState> {
                ...state,
                connected: true,
                connecting: false,
                searchedDevice: action.searchedDevice
            };
        case connectionConstants.GET_CONNECTION_ERROR:
            return <DeviceConnectionState> {
                ...state,
                connected: false,
                connecting: false
            };
        case connectionConstants.CONNECT_SUCCESS:
            return <DeviceConnectionState> {
                ...state,
                connected: true,
                connecting: false,
                connectedDevice: action.device
            }
        case connectionConstants.GET_PUBLIC_DEVICES_SUCCESS:
            return <DeviceConnectionState> {
                ...state,
                publicDevices: action.publicDevices
            };
        case connectionConstants.GET_PUBLIC_DEVICES_ERROR:
            return <DeviceConnectionState> {
                ...state,
                publicDevices: [],
                error: action.error
            }
        default:
            return state;
    }
}