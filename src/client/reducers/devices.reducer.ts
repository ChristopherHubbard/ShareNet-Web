import { deviceConstants } from '../constants';
import { DeviceState, IAction, Device } from '../models';

const initDeviceState: DeviceState =
{
    devices: [],
    healthStates: new Map<string, boolean>(),
    loadingHealthStates: new Map<string, boolean>()
}

export function devices(state: DeviceState = initDeviceState, action: IAction): DeviceState
{
    // Go through possible states for authentication
    switch (action.type)
    {
        case deviceConstants.GET_DEVICES_REQUEST:
            return <DeviceState> {
                ...state,
                loadingDevices: true,
                healthStates: new Map<string, boolean>(),
                loadingHealthStates: new Map<string, boolean>()
            };
        case deviceConstants.GET_DEVICES_SUCCESS:
            return <DeviceState> {
                ...state,
                devices: action.devices,
                loadingDevices: false
            };
        case deviceConstants.GET_DEVICES_ERROR:
            return <DeviceState> {
                ...state,
                devices: [],
                error: action.error
            };
        case deviceConstants.ADD_DEVICE_REQUEST:
            return <DeviceState> {
                ...state,
                loadingDevices: true
            };
        case deviceConstants.ADD_DEVICE_SUCCESS:
            return <DeviceState> {
                ...state,
                devices: action.devices,
                loadingDevices: false
            };
        case deviceConstants.ADD_DEVICE_ERROR:
            return <DeviceState> {
                ...state,
                devices: [],
                error: action.error
            };
        case deviceConstants.REMOVE_DEVICE_REQUEST:
            (state.healthStates as Map<string, boolean>).delete(JSON.stringify(action.device as Device));
            (state.loadingHealthStates as Map<string, boolean>).delete(JSON.stringify(action.device as Device));
            return <DeviceState> {
                ...state,
                loadingDevices: true
            };
        case deviceConstants.REMOVE_DEVICE_SUCCESS:
            return <DeviceState> {
                ...state,
                devices: action.devices,
                loadingDevices: false
            };
        case deviceConstants.REMOVE_DEVICE_ERROR:
            return <DeviceState> {
                ...state,
                loadingDevices: false,
                error: action.error
            };
        case deviceConstants.GET_DEVICE_HEALTH_REQUEST:
            if (!((state.healthStates as Map<string, boolean>).get(JSON.stringify(action.device as Device))))
            {
                (state.loadingHealthStates as Map<string, boolean>).set(JSON.stringify(action.device as Device), true);
            }

            return <DeviceState> {
                ...state
            }
        case deviceConstants.GET_DEVICE_HEALTH_SUCCESS:
            (state.healthStates as Map<string, boolean>).set(JSON.stringify(action.device as Device), action.health as boolean);
            (state.loadingHealthStates as Map<string, boolean>).set(JSON.stringify(action.device as Device), false);

            return <DeviceState> {
                ...state
            };
        case deviceConstants.GET_DEVICE_HEALTH_ERROR:
            (state.healthStates as Map<string, boolean>).set(JSON.stringify(action.device as Device), false);
            (state.loadingHealthStates as Map<string, boolean>).set(JSON.stringify(action.device as Device), false);

            return <DeviceState> {
                ...state
            }
        default:
            return state;
    }
}