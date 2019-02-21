import { devices } from '../reducers';
import { deviceConstants } from '../constants';
import { DeviceState, IAction } from '../models';

describe('Device reducer', () =>
{
    it('should work', () =>
    {
        let state: DeviceState = {
            devices: []
        };

        expect(devices(state, <IAction> {
            type: deviceConstants.GET_DEVICES_REQUEST
        })).toEqual(<DeviceState> {
            loadingDevices: true
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.GET_DEVICES_SUCCESS,
            devices: []
        })).toEqual(<DeviceState> {
            loadingDevices: false,
            devices: [],
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.GET_DEVICES_ERROR,
            error: "ERR"
        })).toEqual(<DeviceState> {
            devices: [],
            error: "ERR"
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.ADD_DEVICE_REQUEST,
        })).toEqual(<DeviceState> {
            loadingDevices: true
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.ADD_DEVICE_SUCCESS,
            devices: []
        })).toEqual(<DeviceState> {
            devices: [],
            loadingDevices: false
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.ADD_DEVICE_ERROR,
            error: "ERR"
        })).toEqual(<DeviceState> {
            devices: [],
            error: "ERR"
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.REMOVE_DEVICE_REQUEST,
        })).toEqual(<DeviceState> {
            loadingDevices: true
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.REMOVE_DEVICE_SUCCESS,
            devices: []
        })).toEqual(<DeviceState> {
            devices: [],
            loadingDevices: false
        });

        expect(devices(state, <IAction> {
            type: deviceConstants.REMOVE_DEVICE_ERROR,
            error: "ERR"
        })).toEqual(<DeviceState> {
            loadingDevices: false,
            error: "ERR"
        });

        expect(devices({ devices: [] }, <IAction> {})).toEqual({ devices: [] });
    });
});