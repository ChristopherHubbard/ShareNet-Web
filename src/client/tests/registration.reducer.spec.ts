import { registration } from '../reducers';
import { userConstants } from '../constants';
import { RegistrationState, IAction, User } from '../models';

describe('Login reducer', () =>
{
    it('should work', () =>
    {
        let state: RegistrationState = {};

        expect(registration(state, <IAction> {
            type: userConstants.REGISTER_REQUEST,
        })).toEqual(<RegistrationState> {
            registering: true
        });

        expect(registration(state, <IAction> {
            type: userConstants.REGISTER_SUCCESS,
        })).toEqual(<RegistrationState> {
            registered: true
        });

        expect(registration(state, <IAction> {
            type: userConstants.REGISTER_ERROR,
        })).toEqual(<RegistrationState> {
            registered: false
        });

        expect(registration(state, <IAction> {})).toEqual(state);
    });
});