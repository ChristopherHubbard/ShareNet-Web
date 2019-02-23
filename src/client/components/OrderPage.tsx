import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { orderActions } from '../actions';
import { OrderPageState as OrderPageProps } from '../models';

export class OrderPage extends React.Component<OrderPageProps & DispatchProp<any>, {}>
{
    public constructor(props: OrderPageProps & DispatchProp<any>)
    {
        super(props);

        // Call the initialization services
        const { dispatch, device } = this.props;

        dispatch(orderActions.getActions(device.contractURL));
        dispatch(orderActions.getInfo(device.contractURL));
        this.onActionChange = this.onActionChange.bind(this);
    }

    private onActionChange(event: React.ChangeEvent<HTMLElement>): void
    {
        const { dispatch, device } = this.props;

        // Send the request to the service for the action price and infoFields
        dispatch(orderActions.getPriceInfo(device.contractURL, event.target.nodeValue as string));

        // Get whether it can be ordered
        dispatch(orderActions.getCanOrder(device.contractURL, event.target.nodeValue as string));
    }

    private onOrder(event: React.MouseEvent<HTMLElement>): void
    {
        const { dispatch, device } = this.props;

        // Dispatch the order -- this will probably all be changed after PayPal/Apple Pay add
    }

    public render(): React.ReactNode
    {
        // Extract prop data
        const { device, actions, priceInfo, infoFields, canOrder, ordering, ordered } = this.props;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div>
                <h1> Order from {device.name} </h1>
                <div>
                    <select disabled={ordering} onChange={this.onActionChange}>
                        {actions.map((action) => <option value={action}> action </option>)}
                    </select>

                    <div>
                        {infoFields.map((infoField) =>
                            <div>
                                <label>Enter the {infoField} </label>
                                <input type="text" name={infoField} disabled={canOrder || ordering}/>
                            </div>
                        )}
                    </div>

                    <p> Price: {priceInfo.price} {priceInfo.baseCurrency}</p>

                    <button disabled={canOrder || ordering} onClick={this.onOrder}> Confirm Order </button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any): OrderPageProps
{
    const { connectedDevice } = state.connection;
    const { actions, priceInfo, infoFields, canOrder, ordering, ordered } = state.order;

    return {
        device: connectedDevice,
        actions,
        priceInfo,
        infoFields,
        canOrder,
        ordering,
        ordered
    };
}

// Connect store and set up redux form
export default connect<OrderPageProps>(
    mapStateToProps
)(OrderPage as any);