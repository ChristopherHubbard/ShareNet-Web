import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, ShallowWrapper } from 'enzyme';

import { CustomInput } from '../../components';

configure({ adapter: new Adapter() });

describe('CustomInput component', () =>
{
    it('should render and show error', () =>
    {
        const meta: any = {
            error: true,
            touched: true
        };

        const wrapper: ShallowWrapper = shallow(<CustomInput input={"Hello"} label={"Email"} type={"text"} meta={meta}/>);
        expect(wrapper).toBeTruthy;
        expect(wrapper.contains(<span/>)).toBeTruthy;
    });

    it('should render and show no error', () =>
    {
        const meta: any = {
            error: false,
            touched: true
        };

        const wrapper: ShallowWrapper = shallow(<CustomInput input={"Hello"} label={"Email"} type={"text"} meta={meta}/>);
        expect(wrapper).toBeTruthy;
        expect(wrapper.contains(<span/>)).toBeFalsy;
    });
});