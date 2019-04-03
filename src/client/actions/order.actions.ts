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
    getPaymentMethods: (contractURL: string) => ((dispatch: Dispatch<any>) => void)
    getCanOrder: (contractURL: string, selectedAction: string) => ((dispatch: Dispatch<any>) => void)
    getInvoice: (contractURL: string, selectedAction: string, infoFields: Map<string, string>, priceInfo: PriceInfo, assetScale: number, method: string) => ((dispatch: Dispatch<any>) => Promise<any>)
    payInvoice: (contractURL: string, selectedAction: string, paymentPointer: string, infoFields: Map<string, string>, priceInfo: PriceInfo, assetScale: number, orderHash: string) => ((dispatch: Dispatch<any>) => void)
}

// Export the user actions
export const orderActions: IOrderActions =
{
    getActions: getActions,
    getInfo: getInfo,
    getPriceInfo: getPriceInfo,
    getPaymentMethods: getPaymentMethods,
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
            // dispatch(orderActions.getInvoice(contractURL, actions[0]));

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
            const [{ asset, assetScale }, { paymentPointer }] = await Promise.all([
                OrderService.getClientAsset(),
                OrderService.getClientPaymentPointer()]
            );
            const priceInfo: PriceInfo = await OrderService.getPriceInfo(contractURL, selectedAction, asset, paymentPointer);
            
            dispatch(<IAction> {
                type: orderConstants.GET_PRICE_SUCCESS,
                priceInfo: priceInfo,
                assetScale: assetScale
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

function getPaymentMethods(contractURL: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_SUPPORTEDMETHODS_REQUEST
        });

        try
        {
            const supportedMethods: Array<string> = await OrderService.getPaymentMethods(contractURL);

            dispatch(<IAction> {
                type: orderConstants.GET_SUPPORTEDMETHODS_SUCCESS,
                supportedMethods: supportedMethods
            });

            dispatch(alertActions.success('Get supported methods success'));
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: orderConstants.GET_SUPPORTEDMETHODS_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Get supported methods error'));
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

function getInvoice(contractURL: string, selectedAction: string, infoFields: Map<string, string>, priceInfo: PriceInfo, assetScale: number, method: string): (dispatch: Dispatch<any>) => Promise<any>
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.GET_INVOICE_REQUEST
        });

        try
        {
            if (method === 'interledger')
            {
                const { paymentPointer, orderHash } = await OrderService.getPaymentPointer(contractURL, selectedAction, infoFields);

                dispatch(<IAction> {
                    type: orderConstants.GET_INVOICE_SUCCESS,
                    paymentPointer: paymentPointer,
                    orderHash: orderHash
                });

                // Pay the invoice!
                dispatch(
                    payInvoice(
                        contractURL,
                        selectedAction,
                        paymentPointer,
                        infoFields,
                        priceInfo,
                        assetScale,
                        orderHash
                    )
                );
            }
            else if (method === 'paypal')
            {
                const { payment_info } = await OrderService.createPayPalPayment(contractURL, selectedAction, infoFields);

                const links: any = {};
                payment_info.links.forEach((linkObj: any) =>
                {
                    links[linkObj.rel] = {
                        href: linkObj.href,
                        method: linkObj.method
                    };
                });

                if (links.hasOwnProperty('approval_url'))
                {
                    const win: Window = window.open(links['approval_url'].href, '_blank') as Window;
                    win.focus();

                    // How to close this window when done? -- this is done server side! -- but might want a local notification...
                }
                else
                {
                    console.error('no redirect URI present');
                }
            }

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

function payInvoice(contractURL: string, selectedAction: string, paymentPointer: string, infoFields: Map<string, string>, priceInfo: PriceInfo, assetScale: number, orderHash: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: orderConstants.PAY_INVOICE_REQUEST
        });

        try
        {
            const receipt: any = await OrderService.payInvoice(contractURL, selectedAction, paymentPointer, infoFields, priceInfo, assetScale, orderHash);

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