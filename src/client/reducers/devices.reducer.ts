import { deviceConstants } from '../constants';
import { DeviceState, IAction, Device } from '../models';

export function devices(state: DeviceState = { devices: [] }, action: IAction): DeviceState
{
    // Go through possible states for authentication
    switch (action.type)
    {
        case deviceConstants.GET_DEVICES_SUCCESS:
            return <DeviceState> {
                devices: action.devices
            };
        case deviceConstants.GET_DEVICES_ERROR:
            return <DeviceState> {
                devices: []
            };
        default:
            return state;
    }
}