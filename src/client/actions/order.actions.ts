import { orderConstants } from '../constants';
import { IAction, Device, PriceInfo } from '../models';
import { OrderService } from '../services';
import { alertActions } from './alert.actions';
import { Dispatch } from 'redux';

// Interfaces for the models
interface IOrderActions
{
    getActions: (contractURL: string) => ((dispatch: Dispatch<any>) => void),
    getInfo: (contractURL: string) => ((dispatch: Dispatch<any>) => void),
    getPriceInfo: (contractURL: string, selectedAction: string) => ((dispatch: Dispatch<any>) => void)
    getCanOrder: (contractURL: string, selectedAction: string) => ((dispatch: Dispatch<any>) => void)
}

// Export the user actions
export const orderActions: IOrderActions =
{
    getActions: getActions,
    getInfo: getInfo,
    getPriceInfo: getPriceInfo,
    getCanOrder: getCanOrder
};

function getActions(contractURL: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_ACTIONS_REQUEST
        });

        try
        {
            const actions: Array<string> = await OrderService.getActions(contractURL);

            dispatch(<IAction> {
                type: orderConstants.GET_ACTIONS_SUCCESS,
                actions: actions
            });

            dispatch(alertActions.success('Get actions success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.GET_ACTIONS_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Get actions error'));
        }
    }
}

function getInfo(contractURL: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_INFO_REQUEST
        });

        try
        {
            const info: Array<string> = await OrderService.getInfo(contractURL);

            dispatch(<IAction> {
                type: orderConstants.GET_INFO_SUCCESS,
                info: info
            });

            dispatch(alertActions.success('Get info success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.GET_INFO_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Get info error'));
        }
    }
}

function getPriceInfo(contractURL: string, selectedAction: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_PRICE_REQUEST
        });

        try
        {
            const priceInfo: PriceInfo = await OrderService.getPriceInfo(contractURL, selectedAction);
            
            dispatch(<IAction> {
                type: orderConstants.GET_PRICE_SUCCESS,
                priceInfo: priceInfo
            });

            dispatch(alertActions.success('Get price info success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.GET_PRICE_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Get price info error'));
        }
    }
}

function getCanOrder(contractURL: string, selectedAction: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_CAN_ORDER_REQUEST
        });

        try
        {
            const canOrder: boolean = await OrderService.getCanOrder(contractURL, selectedAction);
            
            dispatch(<IAction> {
                type: orderConstants.GET_CAN_ORDER_SUCCESS,
                canOrder: canOrder
            });

            dispatch(alertActions.success('Get price info success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.GET_CAN_ORDER_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Get price info error'));
        }
    }
}