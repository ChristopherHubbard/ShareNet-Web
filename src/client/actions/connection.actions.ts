import { connectionConstants } from '../constants';
import { IAction, Device } from '../models';
import { ConnectionService } from '../services';
import { alertActions } from './alert.actions';
import { Dispatch } from 'redux';

// Interfaces for the models
interface IConnectionActions
{
    get: (code: string) => ((dispatch: Dispatch<any>) => void)
    connect: (device: Device) => IAction
}

// Export the user actions
export const connectionActions: IConnectionActions =
{
    get: get,
    connect: connect
};

function get(code: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: connectionConstants.GET_CONNECTION_REQUEST
        });

        try
        {
            const device: Device = await ConnectionService.get(code);

            dispatch(<IAction> {
                type: connectionConstants.GET_CONNECTION_SUCCESS,
                searchedDevice: device
            });

            dispatch(alertActions.success('Connection Success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: connectionConstants.GET_CONNECTION_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Connection error'));
        }
    }
}

function connect(device: Device): IAction
{
    // Dispatch the connection action -- doesn't need to be async since the info is already here
    return <IAction> {
        type: connectionConstants.CONNECT_SUCCESS,
        device: device
    };
}