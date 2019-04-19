import { deviceActions } from '../../actions';
import { deviceConstants } from '../../constants';
import { User, IAction, Device, DeviceCategory, AccessType } from '../../models';
import { DeviceService } from '../../services';
import { Dispatch } from 'redux';
import { String } from '../../../../node_modules/aws-sdk/clients/eks';

describe('Device actions', () =>
{
    const user: User = {
        email: 'test@gmail.com',
        password: '1234567',
        firstname: 'chris',
        lastname: 'h',
    };

    const device: Device = {
        name: "Bar",
        owner: user,
        code: "1234",
        contractURL: "http://hello.com",
        accessType: AccessType.PRIVATE,
        deviceCategory: DeviceCategory.FOOD_AND_DRINK
    }

    const mockDispatch: Dispatch<any> = jest.fn();

    it('should get the devices for this user', async () =>
    {
        DeviceService.get = jest.fn((user: User) => Promise.resolve(new Array<Device>()));
        const res: any = await deviceActions.get(user)(mockDispatch);

        expect(DeviceService.get).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.GET_DEVICES_SUCCESS,
            devices: []
        });
    });

    it('should have error getting devices for this user', async () =>
    {
        DeviceService.get = jest.fn((user: User) => Promise.reject("ERR"));
        const res: any = await deviceActions.get(user)(mockDispatch);

        expect(DeviceService.get).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.GET_DEVICES_ERROR,
            error: "ERR"
        });
    });

    it('should add the device to this user', async () =>
    {
        DeviceService.setupDevice = jest.fn((device: Device, devicePassword: string) => Promise.resolve({ success: true }));
        DeviceService.add = jest.fn((device: Device) => Promise.resolve(new Array<Device>()));
        const res: any = await deviceActions.add(device, '')(mockDispatch);

        expect(DeviceService.setupDevice).toBeCalled();
        expect(DeviceService.add).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.ADD_DEVICE_SUCCESS,
            devices: []
        });
    });

    it('should have error adding the device for this user', async () =>
    {
        DeviceService.setupDevice = jest.fn((device: Device, devicePassword: string) => Promise.resolve({ success: false }));
        DeviceService.add = jest.fn((device: Device) => Promise.reject("ERR"));
        const res: any = await deviceActions.add(device, '')(mockDispatch);

        expect(DeviceService.setupDevice).toBeCalled();
        // expect(DeviceService.add).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.ADD_DEVICE_ERROR,
            error: "Error: Could not setup the device correctly"
        });
    });

    it('should remove the device from the user', async () =>
    {
        DeviceService.remove = jest.fn((device: Device) => Promise.resolve(new Array<Device>()));
        const res: any = await deviceActions.remove(device)(mockDispatch);

        expect(DeviceService.remove).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.REMOVE_DEVICE_SUCCESS,
            devices: []
        });
    });

    it('should have error removing the device for this user', async () =>
    {
        DeviceService.remove = jest.fn((device: Device) => Promise.reject("ERR"));
        const res: any = await deviceActions.remove(device)(mockDispatch);

        expect(DeviceService.remove).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.REMOVE_DEVICE_ERROR,
            error: "ERR"
        });
    });

    it('should get the device health', async () =>
    {
        DeviceService.healthCheck = jest.fn((contractURL: string) => Promise.resolve(true));
        const res: any = await deviceActions.getHealth(device)(mockDispatch);

        expect(DeviceService.healthCheck).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.GET_DEVICE_HEALTH_SUCCESS,
            health: true,
            device: device
        });
    });

    it('should have error getting the device health', async () =>   
    {
        DeviceService.healthCheck = jest.fn((contractURL: string) => Promise.reject('ERR'));
        const res: any = await deviceActions.getHealth(device)(mockDispatch);

        expect(DeviceService.healthCheck).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.GET_DEVICE_HEALTH_ERROR,
            device: device,
            error: "ERR"
        });
    });

    it('should update the device', async () =>
    {
        DeviceService.updateDevice = jest.fn((device: Device, devicePassword: string) => Promise.resolve(new Array<Device>()));
        const res: any = await deviceActions.updateDevice(device, '')(mockDispatch);

        expect(DeviceService.updateDevice).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.GET_DEVICES_SUCCESS,
            devices: [],
        });
    });

    it('should have error trying to update the device', async () =>
    {
        DeviceService.updateDevice = jest.fn((device: Device, devicePassword: string) => Promise.reject('ERR'));
        const res: any = await deviceActions.updateDevice(device, '')(mockDispatch);

        expect(DeviceService.updateDevice).toBeCalled();
        expect(mockDispatch).toBeCalledWith(<IAction> {
            type: deviceConstants.GET_DEVICES_SUCCESS,
            devices: [],
        });
    });
});