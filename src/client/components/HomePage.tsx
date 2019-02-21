import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

interface HomeProps
{
    
}

export class HomePage extends React.Component<HomeProps & DispatchProp<any>, {}>
{
    constructor(props: HomeProps & DispatchProp<any>)
    {
        super(props);
        
        // Get the dispatch function from the props
        const { dispatch } = this.props;
    }

    public render(): React.ReactNode
    {
        // Extract prop data
        const { } = this.props;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div>
                Smart Bar prototype
            </div>
        )
    }
}

function mapStateToProps(state: any): HomeProps
{
    // Extract the state from the action
    const { } = state;
    return {
        
    };
}

export default connect<HomeProps>(
    mapStateToProps
)(HomePage);