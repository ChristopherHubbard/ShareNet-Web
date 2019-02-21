process.env.ENV = "LOCAL"

import { User, Device } from '../models';
import { DeviceService } from '../services';
import Config from '../config';
import axios from 'axios';
import { SinonStub, stub } from 'sinon';

let axiosStubGET: SinonStub;
let axiosStubPOST: SinonStub;
let axiosStubDELETE: SinonStub;

describe('Device service', () =>
{
    beforeAll(() =>
    {
        axiosStubGET = stub(axios, 'get');
        axiosStubPOST = stub(axios, 'post');
        axiosStubDELETE = stub(axios, 'delete');
    });

    afterAll(() =>
    {
        axiosStubGET.restore();
        axiosStubPOST.restore();
        axiosStubDELETE.restore();
    });

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
    };

    it('should get devices', async () =>
    {
        axiosStubGET.withArgs(`${Config.apiUrl}/devices`).resolves({ 
            data: {
                devices: [device]
            }
        });
        const res: Array<Device> = await DeviceService.get(user);

        expect(res).toEqual([device]);
    });

    it('should fail to get devices', async () =>
    {
        axiosStubGET.withArgs(`${Config.apiUrl}/devices`).rejects();
        const res: Array<Device> = await DeviceService.get(user);

        expect(res).toBeFalsy;
    });

    it('should add device', async () =>
    {
        axiosStubPOST.withArgs(`${Config.apiUrl}/devices`).resolves({ 
            data: {
                devices: [device]
            }
        });

        const res: Array<Device> = await DeviceService.add(device);
        expect(res).toEqual([device]);
    });

    it('should fail to add device', async () =>
    {
        axiosStubPOST.withArgs(`${Config.apiUrl}/devices`).rejects();
        const res: Array<Device> = await DeviceService.add(device);

        expect(res).toBeFalsy;
    });

    it('should remove device', async () =>
    {
        axiosStubDELETE.withArgs(`${Config.apiUrl}/devices`).resolves({
            data: {
                devices: []
            }
        });
        const res: Array<Device> = await DeviceService.remove(device);

        expect(res).toEqual([]);
    });

    it('should fail to remove device', async () =>
    {
        axiosStubDELETE.withArgs(`${Config.apiUrl}/devices`).rejects();
        const res: Array<Device> = await DeviceService.remove(device);

        expect(res).toBeFalsy;
    });
});