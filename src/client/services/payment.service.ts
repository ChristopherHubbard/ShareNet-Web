import Config from '../config';

const SERVICE_WORKER_URLS: Map<string, string> = new Map<string, string>(
    [
        ['interledger', `/interledger.js`],
        // ['paypal', '/paypal.js']
    ]
);

export abstract class PaymentService
{
    public static async registerPaymentMethod(paymentMethod: string): Promise<void>
    {
        if (SERVICE_WORKER_URLS.get(paymentMethod))
        {
            const registration: ServiceWorkerRegistration = await navigator.serviceWorker.register(SERVICE_WORKER_URLS.get(paymentMethod) as string)
            console.log('registration', registration);

            await PaymentService.addInstruments(registration);
            console.log('Successfully registered!');
        }
    }

    public static async unregisterPaymentMethod(paymentMethod: string): Promise<void>
    {
        const registration: ServiceWorkerRegistration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URLS.get(paymentMethod)) as ServiceWorkerRegistration;
        console.log('registration', registration);

        // Now unregister this SW -- this shouldnt fail if its registered
        await registration.unregister();
        console.log('Successfully unregistered!');
    }

    private static async addInstruments(registration: any): Promise<Array<any>>
    {
        return Promise.all([
            registration.paymentManager.instruments.set(
                'interledger',
                {
                    name: 'ILP',
                    method: 'interledger',
                    icons: [{
                        src: '/src/client/assets/ilp_icon.png',
                        sizes: '32x32',
                        type: 'image/png'
                    }]
                }
            ),
            registration.paymentManager.instruments.set(
                'paypal',
                {
                    name: 'Pay with Paypal',
                    method: 'paypal',
                    icons: [{
                        src: '/src/client/assets/paypal_icon.png',
                        sizes: '32x32',
                        type: 'image/png'
                    }]
                }
            )
        ]);
    }
}