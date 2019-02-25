import * as React from 'react';
import { Dispatch } from 'redux';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, ShallowWrapper, mount } from 'enzyme';
import { User, Device } from '../models';
import { DeviceItem } from '../components';

configure({ adapter: new Adapter() });

describe('DeviceItem component', () =>
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
    };

    const mockDispatch: Dispatch<any> = jest.fn();

    it('should render non-connected component', () =>
    {
        const wrapper: ShallowWrapper = shallow(
            <DeviceItem device={device} dispatch={mockDispatch}/>
        );

        expect(wrapper.exists()).toBeTruthy;
    });

    it('should select this device', () =>
    {
        const wrapper = mount(
            <DeviceItem device={device} dispatch={mockDispatch}/>
        );

        wrapper.find('li').simulate('click');
        expect(wrapper.state('selected')).toEqual(true);
    });

    it('should unselect this device', () => 
    {
        const wrapper = mount(
            <DeviceItem device={device} dispatch={mockDispatch}/>
        );

        wrapper.find('li').simulate('click');
        expect(wrapper.state('selected')).toEqual(true);
    });

    it('should remove the device', () =>
    {
        const wrapper = mount(
            <DeviceItem device={device} dispatch={mockDispatch}/>
        );

        wrapper.find('li').simulate('click');
        expect(wrapper.state('selected')).toEqual(true); 
        wrapper.find('button').simulate('click');
        expect(wrapper.state('selected')).toEqual(true);
        expect(mockDispatch).toBeCalled();
    });
});