import * as React from 'react';
import Menu from './Menu';

export default class HomePage extends React.Component<{}, {}>
{
    public constructor(props: any)
    {
        super(props);
    }

    public render(): React.ReactNode
    {
        // Extract prop data
        const { } = this.props;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div>
                Smart Bar prototype
                <Menu/>
            </div>
        )
    }
}