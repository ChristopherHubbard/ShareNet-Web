import { paymentConstants } from '../constants';
import { IAction, Device, PriceInfo } from '../models';
import { PaymentService } from '../services';
import { alertActions } from './alert.actions';
import { Dispatch } from 'redux';

// Interfaces for the models
interface IOrderActions
{
    registerPaymentMethod: (paymentMethod: string) => ((dispatch: Dispatch<any>) => void),
    unregisterPaymentMethod: (paymentMethod: string) => ((dispatch: Dispatch<any>) => void)
}

// Export the user actions
export const paymentActions: IOrderActions =
{
    registerPaymentMethod: registerPaymentMethod,
    unregisterPaymentMethod: unregisterPaymentMethod
};

function registerPaymentMethod(paymentMethod: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        try
        {
            await PaymentService.registerPaymentMethod(paymentMethod);
        }
        catch (error)
        {
            console.error(error);

            dispatch(alertActions.error('Register payment method failed'));
        }
    }
}

function unregisterPaymentMethod(paymentMethod: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        try
        {
            // Dont care about the result -- it will just throw an error on failure
            await PaymentService.unregisterPaymentMethod(paymentMethod);
        }
        catch (error)
        {
            console.error(error);

            dispatch(alertActions.error('Unregister payment method failed'));
        }
    }
}