import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, ShallowWrapper } from 'enzyme';

import { App } from '../components';

configure({ adapter: new Adapter() });

describe('App component', () =>
{
    it('should render the app', () =>
    {
        const wrapper: ShallowWrapper = shallow<App>(<App/>);
        expect(wrapper).toBeTruthy;
    });
});