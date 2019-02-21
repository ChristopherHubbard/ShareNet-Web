import { deviceConstants } from '../constants';
import { DeviceState, IAction, Device } from '../models';

export function devices(state: DeviceState = { devices: [] }, action: IAction): DeviceState
{
    // Go through possible states for authentication
    switch (action.type)
    {
        case deviceConstants.GET_DEVICES_REQUEST:
            return <DeviceState> {
                loadingDevices: true
            };
        case deviceConstants.GET_DEVICES_SUCCESS:
            return <DeviceState> {
                devices: action.devices,
                loadingDevices: false
            };
        case deviceConstants.GET_DEVICES_ERROR:
            return <DeviceState> {
                devices: [],
                error: action.error
            };
        case deviceConstants.ADD_DEVICE_REQUEST:
            return <DeviceState> {
                loadingDevices: true
            };
        case deviceConstants.ADD_DEVICE_SUCCESS:
            return <DeviceState> {
                devices: action.devices,
                loadingDevices: false
            };
        case deviceConstants.ADD_DEVICE_ERROR:
            return <DeviceState> {
                devices: [],
                error: action.error
            };
        case deviceConstants.REMOVE_DEVICE_REQUEST:
            return <DeviceState> {
                loadingDevices: true
            };
        case deviceConstants.REMOVE_DEVICE_SUCCESS:
            return <DeviceState> {
                devices: action.devices,
                loadingDevices: false
            };
        case deviceConstants.REMOVE_DEVICE_ERROR:
            return <DeviceState> {
                loadingDevices: false,
                error: action.error
            };
        default:
            return state;
    }
}