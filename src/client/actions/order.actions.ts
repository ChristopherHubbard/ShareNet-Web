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
    getInvoice: (contractURL: string, selectedAction: string) => ((dispatch: Dispatch<any>) => void)
    payInvoice: (contractURL: string, selectedAction: string, paymentPointer: string, infoFields: Map<string, string>, priceInfo: PriceInfo) => ((dispatch: Dispatch<any>) => void)
}

// Export the user actions
export const orderActions: IOrderActions =
{
    getActions: getActions,
    getInfo: getInfo,
    getPriceInfo: getPriceInfo,
    getCanOrder: getCanOrder,
    getInvoice: getInvoice,
    payInvoice: payInvoice
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

            // Dispatch all the subsequent events -- invoice etc
            dispatch(orderActions.getPriceInfo(contractURL, actions[0]));

            // Get whether it can be ordered
            dispatch(orderActions.getCanOrder(contractURL, actions[0]));

            // Get the invoice?
            dispatch(orderActions.getInvoice(contractURL, actions[0]));

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

function getInvoice(contractURL: string, selectedAction: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_INVOICE_REQUEST
        });

        try
        {
            const { paymentPointer } = await OrderService.getPaymentPointer(contractURL, selectedAction);

            dispatch(<IAction> {
                type: orderConstants.GET_INVOICE_SUCCESS,
                paymentPointer: paymentPointer
            });

            dispatch(alertActions.success('Get invoice success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.GET_INVOICE_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Get invoice error'));
        }
    }
}

function payInvoice(contractURL: string, selectedAction: string, paymentPointer: string, infoFields: Map<string, string>, priceInfo: PriceInfo): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.PAY_INVOICE_REQUEST
        });

        try
        {
            const receipt: any = await OrderService.payInvoice(contractURL, selectedAction, paymentPointer, infoFields, priceInfo);

            dispatch(<IAction> {
                type: orderConstants.PAY_INVOICE_SUCCESS,
                receipt: receipt
            });

            dispatch(alertActions.success('Pay invoice success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.PAY_INVOICE_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Pay invoice error'));
        }
    }
}