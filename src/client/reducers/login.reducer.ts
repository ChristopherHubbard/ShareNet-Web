import { userConstants } from '../constants';
import { User, LoginState, IAction } from '../models';

const user: User = JSON.parse(JSON.stringify(localStorage.getItem('user')));
const initialState: LoginState = user ? { loggedIn: true, user: user } : {};

export function login(state: LoginState = initialState, action: IAction): LoginState
{
    // Go through possible states for authentication
    switch (action.type)
    {
        case userConstants.LOGIN_REQUEST:
            return <LoginState> {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return <LoginState> {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return <LoginState> {};
        case userConstants.LOGOUT_SUCCESS:
            return <LoginState> {};
        default:
            return state;
    }
}