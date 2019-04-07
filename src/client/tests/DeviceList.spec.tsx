import * as React from 'react';
import { Dispatch } from 'redux';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, ShallowWrapper, mount } from 'enzyme';
import { User, Device, AccessType, DeviceCategory } from '../models';
import { DeviceList } from '../components';

configure({ adapter: new Adapter() });

describe('DeviceList component', () =>
{
    const user: User = {
        email: 'test@gmail.com',
        password: '1234567',
        firstname: 'chris',
        lastname: 'h',
    };

    const devices: Array<Device> = [
    {
        name: "Bar",
        owner: user,
        code: "1234",
        contractURL: "http://hello.com",
        accessType: AccessType.PRIVATE,
        deviceCategory: DeviceCategory.COMPUTE
    },
    {
        name: "Bar2",
        owner: user,
        code: "12345",
        contractURL: "http://hello2.com",
        accessType: AccessType.PRIVATE,
        deviceCategory: DeviceCategory.COMPUTE
    }];

    const mockDispatch: Dispatch<any> = jest.fn();

    beforeAll(() =>
    {
       localStorage.setItem('user', JSON.stringify(user)); 
    });

    it('should render non-connected component', () =>
    {
        const wrapper: ShallowWrapper = shallow(
            <DeviceList devices={devices} dispatch={mockDispatch}/>
        );

        expect(wrapper.exists()).toBeTruthy;
    });

    it('should add device', () =>
    {
        const wrapper = shallow(
            <DeviceList devices={devices} dispatch={mockDispatch}/>
        );

        wrapper.find('button').simulate('click');
        expect(wrapper.state('openNewDeviceDialog')).toBeTruthy;
        expect(wrapper.find('input').exists()).toBeTruthy;
        wrapper.find({ name: "add" }).simulate('click');
        expect(mockDispatch).toBeCalled();
    });

    it('should cancel adding the device', () =>
    {
        const wrapper = shallow(
            <DeviceList devices={devices} dispatch={mockDispatch}/>
        );

        wrapper.find('button').simulate('click');
        expect(wrapper.state('openNewDeviceDialog')).toBeTruthy;
        expect(wrapper.find('input').exists()).toBeTruthy;
        wrapper.find({ name: "code" }).simulate('change', {
            target: {
                name: "code",
                value: "a"
            }
        });
        expect(wrapper.state('newDevice')).toEqual({
            code: "a",
            name: '',
            owner: user,
            contractURL: ''

        });
        wrapper.find({ name: "cancelAdd" }).simulate('click');
        expect(wrapper.state('openNewDeviceDialog')).toBeFalsy;
    });

    it('should fail to get user', () =>
    {
        localStorage.removeItem('user');
        const wrapper = shallow(
            <DeviceList devices={devices} dispatch={mockDispatch}/>
        );

        expect(mockDispatch).toBeCalled();
    });
});