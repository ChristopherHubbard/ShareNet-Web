import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-dom/test-utils';
import { alertConstants } from '../constants';
import { alertActions } from '../actions';

describe('Alert actions', () =>
{

    it('should check all alert actions functions', () => 
    {

        expect(alertActions.success('')).toEqual({
            type: alertConstants.SUCCESS,
            message: ''
        });

        expect(alertActions.error('')).toEqual({
            type: alertConstants.ERROR,
            message: ''
        });

        expect(alertActions.clear('')).toEqual({
            type: alertConstants.CLEAR,
            message: ''
        });
    });
});