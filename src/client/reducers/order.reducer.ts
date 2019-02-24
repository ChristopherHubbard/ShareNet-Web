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
                ...state,
                ordered: false,
                ordering: false,
                canOrder: false
            };
        case orderConstants.GET_ACTIONS_SUCCESS:
            return <OrderPageState> {
                ...state,
                actions: action.actions
            };
        case orderConstants.GET_ACTIONS_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.GET_INFO_SUCCESS:
            return <OrderPageState> {
                ...state,
                infoFields: action.info
            };
        case orderConstants.GET_INFO_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.GET_PRICE_SUCCESS:
            return <OrderPageState> {
                ...state,
                priceInfo: action.priceInfo
            };
        case orderConstants.GET_PRICE_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.GET_CAN_ORDER_SUCCESS:
            return <OrderPageState> {
                ...state,
                canOrder: action.canOrder
            };
        case orderConstants.GET_CAN_ORDER_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        default:
            return state;
    }
}