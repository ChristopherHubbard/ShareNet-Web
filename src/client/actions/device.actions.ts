import { deviceConstants } from '../constants';
import { IAction, Device, User } from '../models';
import { DeviceService } from '../services';
import { alertActions } from './alert.actions';
import { Dispatch } from 'redux';

// Interfaces for the models
interface IDeviceActions
{
    get: (user: User) => ((dispatch: Dispatch<any>) => void),
    get_public: () => ((dispatch: Dispatch<any>) => void),
    add: (device: Device) => ((dispatch: Dispatch<any>) => void),
    remove: (device: Device) => ((dispatch: Dispatch<any>) => void)
}

// Export the user actions
export const deviceActions: IDeviceActions =
{
    get: get,
    get_public: get_public,
    add: add,
    remove: remove
};

function get(user: User): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) => 
    {
        dispatch(<IAction> {
            type: deviceConstants.GET_DEVICES_REQUEST
        });

        try
        {
            const devices: Array<Device> = await DeviceService.get(user);

            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICES_SUCCESS,
                devices: devices
            });

            dispatch(alertActions.success('Get Devices Success'));
        }
        catch (error)
        {
            // Dispatch error actions
            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICES_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Error retrieving devices'));
        }
    }
}

function get_public(): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: deviceConstants.GET_PUBLIC_DEVICES_REQUEST
        });

        try
        {
            const devices: Array<Device> = await DeviceService.get_public_devices();

            dispatch(<IAction> {
                type: deviceConstants.GET_PUBLIC_DEVICES_SUCCESS,
                publicDevices: devices
            });

            // Dispatch the sucess
            dispatch(alertActions.success('Get Public Devices Success'));
        }
        catch (error)
        {
            // Dispatch error actions
            dispatch(<IAction> {
                type: deviceConstants.GET_PUBLIC_DEVICES_ERROR,
                error: error.toString()
            });
            dispatch(alertActions.error('Get Public Devices Failure'));
        }
    }
}

// Function to create register user
function add(device: Device): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) => 
    {
        dispatch(<IAction> {
            type: deviceConstants.ADD_DEVICE_REQUEST,
            device: device
        });

        // Check type for this response
        try
        {
            // Should be a post so no real response
            const devices: Array<Device> = await DeviceService.add(device);

            // Send success dispatches
            dispatch(<IAction> {
                type: deviceConstants.ADD_DEVICE_SUCCESS,
                devices: devices
            });

            // Dispatch the sucess
            dispatch(alertActions.success('Add Device Success'));
        }
        catch (error)
        {
            // Dispatch error actions
            dispatch(<IAction> {
                type: deviceConstants.ADD_DEVICE_ERROR,
                error: error.toString()
            });
            dispatch(alertActions.error('Add Device Failure'));
        }
    }
}

function remove(device: Device): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: deviceConstants.REMOVE_DEVICE_REQUEST,
            device: device
        });

        try
        {
            // User the service to login
            const devices: Array<Device> = await DeviceService.remove(device);

            dispatch(<IAction> {
                type: deviceConstants.REMOVE_DEVICE_SUCCESS,
                devices: devices
            });

            dispatch(alertActions.success('Device Remove Success'));        
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: deviceConstants.REMOVE_DEVICE_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Device Remove Error'));
        }
    }
}