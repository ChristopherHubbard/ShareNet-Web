import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { orderActions } from '../actions';
import { OrderPageState as OrderPageProps } from '../models';
import PaymentButton from './PaymentRequestButton';
import PaymentRequestButton from './PaymentRequestButton';

// Try to work around webpack?
const SERVICE_WORKER_URL: string = window.location.origin + '/interledger.js';

interface OrderPageState
{
    selectedAction: string,
    infoFieldMap: Map<string, string>
}

export class OrderPage extends React.Component<OrderPageProps & DispatchProp<any>, OrderPageState>
{
    public constructor(props: OrderPageProps & DispatchProp<any>)
    {
        super(props);

        this.state = {
            selectedAction: '',
            infoFieldMap: new Map<string, string>()
        };

        // Call the initialization services
        const { dispatch, device } = this.props;

        dispatch(orderActions.getActions(device.contractURL));
        dispatch(orderActions.getInfo(device.contractURL));

        this.onActionChange = this.onActionChange.bind(this);
        this.onOrder = this.onOrder.bind(this);
        this.selectionChangeEvent = this.selectionChangeEvent.bind(this);
        this.onUpdateInfoField = this.onUpdateInfoField.bind(this);
        this.registerPaymentService = this.registerPaymentService.bind(this);
        this.addInstruments = this.addInstruments.bind(this);

        this.registerPaymentService();
    }

    private onActionChange(event: React.ChangeEvent<HTMLSelectElement>): void
    {
        this.selectionChangeEvent(event.target.value);
    }

    private async onOrder(event: React.MouseEvent<HTMLElement>): Promise<void>
    {
        event.preventDefault();

        const { dispatch, device, paymentPointer, priceInfo, assetScale } = this.props;
        const { selectedAction, infoFieldMap } = this.state;

        // How to get the invoice?

        const methodData = [
            {
                supportedMethods: Array<string>('interledger'),
                data: {
                    paymentPointer
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

            dispatch(orderActions
                .payInvoice(
                    device.contractURL,
                    selectedAction,
                    paymentPointer,
                    infoFieldMap,
                    priceInfo,
                    assetScale
                )
            );

            // Emit a successful completion -- but the event was dispatched not fulfilled?
            result.complete('success');
        }
        catch (error)
        {
            console.error('Payment failure!');
        }
    }

    private selectionChangeEvent(selectedName: string): void
    {
        const { dispatch, device } = this.props;

        // Send the request to the service for the action price and infoFields
        dispatch(orderActions.getPriceInfo(device.contractURL, selectedName));

        // Get whether it can be ordered
        dispatch(orderActions.getCanOrder(device.contractURL, selectedName));

        // Get the invoice?
        dispatch(orderActions.getInvoice(device.contractURL, selectedName));

        // Update the state
        this.setState((prevState) => ({
            ...prevState,
            selectedAction: selectedName,
        }));
    }

    private onUpdateInfoField(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const { infoFieldMap } = this.state;
        infoFieldMap.set(event.target.name, event.currentTarget.value);

        this.setState((prevState) => ({
            ...prevState,
            infoFieldMap: infoFieldMap
        }));
    }

    public componentDidUpdate(): void
    {
        const { actions } = this.props;

        if (!this.state.selectedAction)
        {
            this.setState((prevState) => ({
                ...prevState,
                selectedAction: actions[0]
            }));
        }
    }

    private registerPaymentService(): void
    {
        navigator.serviceWorker.register(SERVICE_WORKER_URL).then((registration: any) =>
        {
            console.log('registration', registration);
            if (!registration.paymentManager)
            {
                registration.unregister().then((success: any) => {});
                console.log('Payment app capability not present. Enable flags?');
                return;
            }
            this.addInstruments(registration).then(function () {
              console.log('Successfully registered!');
            })
        })
        .catch((error) =>
        {
            console.log('Service worker registration error', error);
        })
    }

    private addInstruments(registration: any)
    {
        registration.paymentManager.userHint = 'test@interledgerpay.xyz';
        return Promise.all([
          registration.paymentManager.instruments.set(
            '5c077d7a-0a4a-4a08-986a-7fb0f5b08b13',
            {
              name: 'ILP',
              icons: [{
                src: '/src/client/assets/ilp_icon.png',
                sizes: '32x32',
                type: 'image/png'}
              ],
              method: 'interledger'
            })
        ]);
    }

    public render(): React.ReactNode
    {
        // Extract prop data
        const { device, actions, priceInfo, assetScale, infoFields, canOrder, ordering, ordered } = this.props;

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

                    {priceInfo ? <p> Price: {priceInfo.price} {priceInfo.baseCurrency}</p> : null}

                    <PaymentRequestButton show={this.onOrder} disabled={ordering || !canOrder}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any): OrderPageProps
{
    const { connectedDevice } = state.connection;
    const { actions, priceInfo, assetScale, infoFields, canOrder, ordering, ordered, paymentPointer } = state.order;

    return {
        device: connectedDevice,
        actions,
        priceInfo,
        assetScale,
        infoFields,
        canOrder,
        ordering,
        ordered,
        paymentPointer
    };
}

// Connect store and set up redux form
export default connect<OrderPageProps>(
    mapStateToProps
)(OrderPage as any);