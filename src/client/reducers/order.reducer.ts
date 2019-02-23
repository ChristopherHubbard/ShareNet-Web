import { orderConstants } from '../constants';
import { OrderPageState, IAction } from '../models';

const initState: OrderPageState = {
    device: {
        name: '',
        code: '',
        contractURL: ''
    },
    actions: [],
    priceInfo: {
        price: 0.00,
        baseCurrency: 'USD'
    },
    infoFields: [],
    canOrder: false,
    ordering: false,
    ordered: false
};

export function order(state: OrderPageState = initState, action: IAction): OrderPageState
{
    // Go through possible states for authentication
    switch (action.type)
    {
        case orderConstants.GET_ACTIONS_REQUEST:
            return <OrderPageState> {
                ordered: false,
                ordering: false,
                canOrder: false
            };
        case orderConstants.GET_ACTIONS_SUCCESS:
            return <OrderPageState> {
                actions: action.actions
            };
        case orderConstants.GET_ACTIONS_ERROR:
            return <OrderPageState> {
                canOrder: false
            };
        case orderConstants.GET_INFO_SUCCESS:
            return <OrderPageState> {
                infoFields: action.info
            };
        case orderConstants.GET_INFO_ERROR:
            return <OrderPageState> {
                canOrder: false
            };
        case orderConstants.GET_PRICE_SUCCESS:
            return <OrderPageState> {
                priceInfo: action.priceInfo
            };
        case orderConstants.GET_PRICE_ERROR:
            return <OrderPageState> {
                canOrder: false
            };
        case orderConstants.GET_CAN_ORDER_SUCCESS:
            return <OrderPageState> {
                canOrder: action.canOrder
            };
        case orderConstants.GET_CAN_ORDER_ERROR:
            return <OrderPageState> {
                canOrder: false
            };
        default:
            return state;
    }
}