import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { indexActions, predictionActions } from '../actions';

interface HomeProps
{
    
}

class HomePage extends React.Component<HomeProps & DispatchProp<any>, {}>
{
    constructor(props: HomeProps & DispatchProp<any>)
    {
        super(props);
        
        // Get the dispatch function from the props
        const { dispatch } = this.props;

        // On initialization set dispatch the action to get the indicies and then send the dispatch action
        dispatch(indexActions.getCompanyList());

        // Bind methods
        this.onIndexChange = this.onIndexChange.bind(this);
    }

    private onIndexChange(event: React.ChangeEvent<HTMLSelectElement>): void
    {
        // When the index changes, dispatch the prediction action
        const { dispatch } = this.props;
        const selectedIndex = event.target.value;

        // When the index changes -- dispatch the prediction action, which should first crawl on this index and then predict
        dispatch(predictionActions.predict(selectedIndex));
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
    const { } = state.companies;
    return {
        
    };
}

export default connect<HomeProps>(
    mapStateToProps
)(HomePage);