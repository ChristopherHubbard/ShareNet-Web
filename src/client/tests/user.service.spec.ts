process.env.ENV = "LOCAL"

import { User } from '../models';
import { UserService } from '../services';
import Config from '../config';
import axios from 'axios';
import { SinonStub, stub } from 'sinon';

let axiosStubGET: SinonStub;
let axiosStubPOST: SinonStub;
let axiosStubDELETE: SinonStub;

describe('User service', () =>
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

    it('should register user', async () =>
    {
        axiosStubPOST.withArgs(`${Config.apiUrl}/users/register`).resolves("SUCCESS");

        const res: any = await UserService.register(user);
        expect(res).toEqual("SUCCESS");
    });

    it('should fail to register user', async () =>
    {
        axiosStubPOST.withArgs(`${Config.apiUrl}/users/register`).rejects("ERROR");

        const res: any = await UserService.register(user);
        expect(res).toBeFalsy;
    });

    it('should login user', async () =>
    {
        axiosStubGET.withArgs(`${Config.apiUrl}/users/login`).resolves({
            data: user
        });

        const res: any = await UserService.login(user);
        expect(res).toEqual(user);
        expect(JSON.parse(localStorage.getItem('user') as string)).toEqual(user);
        localStorage.removeItem('user');
    });

    it('should fail to login user', async () =>
    {
        axiosStubGET.withArgs(`${Config.apiUrl}/users/login`).rejects({
            data: user
        });

        const res: any = await UserService.login(user);
        expect(res).toBeFalsy;
        expect(localStorage.getItem('user')).toBeNull;
    });

    it('should logout user', () =>
    {
        localStorage.setItem('user', 'Chris');
        UserService.logout();
        expect(localStorage.getItem('user')).toBeFalsy;
    });
});