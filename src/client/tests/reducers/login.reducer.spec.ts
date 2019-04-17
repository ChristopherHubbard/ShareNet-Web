import { login } from '../../reducers';
import { userConstants } from '../../constants';
import { User, LoginState, IAction } from '../../models';

describe('Login reducer', () =>
{
    it('should work', () =>
    {
        const user: User = {
            email: 'test@gmail.com',
            password: '1234567',
            firstname: 'chris',
            lastname: 'h',
        };

        let state: LoginState = {
            loggedIn: true,
            user: user
        };

        expect(login(state, <IAction> {
            type: userConstants.LOGIN_REQUEST,
            user: user
        })).toEqual(<LoginState> {
            loggingIn: true,
            user: user
        });

        expect(login(state, <IAction> {
            type: userConstants.LOGIN_SUCCESS,
            user: user
        })).toEqual(<LoginState> {
            loggedIn: true,
            user: user
        });

        expect(login(state, <IAction> {
            type: userConstants.LOGIN_FAILURE,
        })).toEqual({});

        expect(login(state, <IAction> {
            type: userConstants.LOGOUT_SUCCESS,
        })).toEqual({});

        expect(login(state, <IAction> {})).toEqual(state);
    });
});