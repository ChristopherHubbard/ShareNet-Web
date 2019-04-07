import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { orderActions, paymentActions } from '../actions';
import { OrderPageState as OrderPageProps } from '../models';
import { PaymentRequestButton } from './PaymentRequestButton';
import { PayPalRequestButton } from './PayPalRequestButton';

interface OrderPageState
{
    selectedAction: string,
    infoFieldMap: Map<string, string>,
    registeredPaymentMethods: Array<string>
}

export class OrderPage extends React.Component<OrderPageProps & DispatchProp<any>, OrderPageState>
{
    public constructor(props: OrderPageProps & DispatchProp<any>)
    {
        super(props);

        this.state = {
            selectedAction: '',
            infoFieldMap: new Map<string, string>(),
            registeredPaymentMethods: new Array<string>()
        };

        // Call the initialization services
        const { dispatch, device } = this.props;

        dispatch(orderActions.getActions(device.contractURL));
        dispatch(orderActions.getInfo(device.contractURL));
        dispatch(orderActions.getPaymentMethods(device.contractURL));

        this.onActionChange = this.onActionChange.bind(this);
        this.onILPOrder = this.onILPOrder.bind(this);
        this.onPayPalOrder = this.onPayPalOrder.bind(this);
        this.selectionChangeEvent = this.selectionChangeEvent.bind(this);
        this.onUpdateInfoField = this.onUpdateInfoField.bind(this);
    }

    private onActionChange(event: React.ChangeEvent<HTMLSelectElement>): void
    {
        this.selectionChangeEvent(event.target.value);
    }

    private async onILPOrder(event: React.MouseEvent<HTMLElement>): Promise<void>
    {
        event.preventDefault();

        const { dispatch, device, priceInfo, assetScale } = this.props;
        const { selectedAction, infoFieldMap } = this.state;

        // Create the method data using the possible supported methods?
        const methodData = [
            {
                supportedMethods: 'interledger',
                data: {
                }
            }
        ];

        const details = {
            total: {
                label: 'Total',
                amount: {
                    currency: priceInfo.baseCurrency,
                    value: priceInfo.price.toString()
                }
            }
        };

        try
        {
            const result: PaymentResponse = await new PaymentRequest(methodData, details).show();

            // Change this function name -- it sucks
            dispatch(orderActions.getInvoice(device.contractURL, selectedAction, infoFieldMap, priceInfo, assetScale, 'interledger'));

            // Emit a successful completion -- but the event was dispatched not fulfilled?
            result.complete('success');
        }
        catch (error)
        {
            console.error('Payment failure!');
        }
    }

    private onPayPalOrder(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        const { dispatch, device, priceInfo, assetScale } = this.props;
        const { selectedAction, infoFieldMap } = this.state;

        dispatch(orderActions.getInvoice(device.contractURL, selectedAction, infoFieldMap, priceInfo, assetScale, 'paypal'))
    }

    private selectionChangeEvent(selectedName: string): void
    {
        const { dispatch, device } = this.props;

        // Send the request to the service for the action price and infoFields
        dispatch(orderActions.getPriceInfo(device.contractURL, selectedName));

        // Get whether it can be ordered
        dispatch(orderActions.getCanOrder(device.contractURL, selectedName));

        // Update the state
        this.setState((prevState) => ({
            ...prevState,
            selectedAction: selectedName,
        }));
    }

    private onUpdateInfoField(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const { dispatch, device } = this.props;
        const { selectedAction, infoFieldMap } = this.state;
        infoFieldMap.set(event.target.name, event.currentTarget.value);

        this.setState((prevState) => ({
            ...prevState,
            infoFieldMap: infoFieldMap
        }));
    }

    public componentDidUpdate(): void
    {
        const { dispatch, device, actions, supportedMethods } = this.props;
        const { selectedAction, registeredPaymentMethods, infoFieldMap } = this.state;

        if (!selectedAction)
        {
            this.setState((prevState) => ({
                ...prevState,
                selectedAction: actions[0]
            }));
        }

        if (registeredPaymentMethods.length < supportedMethods.length)
        {
            // New payment method to register -- register ILP or PayPal basically
            for (const paymentMethod of supportedMethods)
            {
                if (!registeredPaymentMethods.includes(paymentMethod))
                {
                    // Register this payment method
                    dispatch(paymentActions.registerPaymentMethod(paymentMethod));
                }
            }

            // Set the new registered payment methods
            this.setState((prevState) => ({
                ...prevState,
                registeredPaymentMethods: supportedMethods
            }));
        }
        else if (registeredPaymentMethods.length > supportedMethods.length)
        {
            // Remove unnecessary payment methods
            for (const paymentMethod of registeredPaymentMethods)
            {
                if (!supportedMethods.includes(paymentMethod))
                {
                    // Register this payment method
                    dispatch(paymentActions.unregisterPaymentMethod(paymentMethod));
                }
            }

            // Set the new registered payment methods
            this.setState((prevState) => ({
                ...prevState,
                registeredPaymentMethods: supportedMethods
            }));
        }
    }

    public render(): React.ReactNode
    {
        // Extract prop data
        const { device, actions, priceInfo, assetScale, infoFields, canOrder, ordering, ordered, supportedMethods } = this.props;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div>
                <h1> Order from {device.name} </h1>
                <div>
                    <select disabled={ordering} onChange={this.onActionChange}>
                        {
                            actions && actions.length > 0 ?
                            actions.map((action, i) => <option key={i} value={action}> {action} </option>)
                            : <option key="-1" value="No actions available"> No actions available </option>
                        }
                    </select>

                    <div>
                        {
                            infoFields && infoFields.length > 0 ?
                            infoFields.map((infoField) =>
                            <div>
                                <label>Enter the {infoField} </label>
                                <input type="text" name={infoField} disabled={!canOrder || ordering} onChange={this.onUpdateInfoField}/>
                            </div>)
                            : null
                        }
                    </div>

                    { priceInfo ? <p> Price: {priceInfo.price} {priceInfo.baseCurrency}</p> : null }

                    <div>
                        {
                            supportedMethods.map((el) =>
                            {
                                if (el === 'interledger')
                                {
                                    return <PaymentRequestButton show={this.onILPOrder} isSupported={true} disabled={ordering || !canOrder} className={"interledger"}/>
                                }
                                else if (el === 'paypal')
                                {
                                    return <PayPalRequestButton show={this.onPayPalOrder} isSupported={true} disabled={ordering || !canOrder} className={"paypal"}/>
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any): OrderPageProps
{
    const { connectedDevice } = state.connection;
    const { actions, priceInfo, assetScale, infoFields, canOrder, ordering, ordered, supportedMethods } = state.order;

    return {
        device: connectedDevice,
        actions,
        priceInfo,
        assetScale,
        infoFields,
        canOrder,
        ordering,
        ordered,
        supportedMethods
    };
}

// Connect store and set up redux form
export default connect<OrderPageProps>(
    mapStateToProps
)(OrderPage as any);