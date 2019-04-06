import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import Config from '../config';
import { PriceInfo } from '../models';

// Create the axios caching instance
const cachios = require('cachios');

// Abstract since totally static class
export abstract class OrderService
{
    public static async getActions(contractURL: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
            },
            params: {}
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${contractURL}/actions`, requestOptions);

            // Return the devices for this user
            return response.data.actions;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    // Static async method
    public static async getInfo(contractURL: string): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {}
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${contractURL}/info`, requestOptions);

            // Return the devices for this user
            return response.data.infoFields;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async getClientAsset(): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try
        {
            const response: AxiosResponse = await axios.get(`${Config.moneydUrl}/asset`, requestOptions);

            return response.data;
        }
        catch (error)
        {
            console.error(error);
        }
    }

    public static async getClientPaymentPointer(): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            ttl: 60 // Keep the result for a minute at least
        };

        try
        {
            // Get the clients payment pointer -- cache this to reduce latency issues when using cloud config
            const response: AxiosResponse = await cachios.get(`${Config.moneydUrl}/receiver`, requestOptions);

            return response.data;
        }
        catch (error)
        {
            console.error(error);
        }
    }

    public static async getPriceInfo(contractURL: string, action: string, clientAsset: string, clientPaymentPointer: string): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                action: action,
                clientAsset: clientAsset,
                clientPaymentPointer: clientPaymentPointer
            }
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${contractURL}/priceInfo`, requestOptions);

            // Return the devices for this user
            return response.data.priceInfo;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async getPaymentMethods(contractURL: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try
        {
            const response: AxiosResponse = await axios.get(`${contractURL}/paymentMethods`, requestOptions);

            return response.data.supportedMethods;
        }
        catch (error)
        {
            // How to handle no supported methods? Need better error handling
            console.error(error);
        }
    }

    public static async getCanOrder(contractURL: string, action: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                action: action
            }
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${contractURL}/canOrder`, requestOptions);

            // Return the devices for this user
            return response.data.canOrder;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async getPaymentPointer(contractURL: string, action: string, infoFields: Map<string, string>): Promise<any>
    {
        const infoFieldJSON: any = Array.from(
                infoFields.entries()
            )
            .reduce((o: any, [key, value]) => { 
                o[key] = value; 
        
                return o; 
            }, {});
        
        const requestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: action,
                infoFields: JSON.stringify(infoFieldJSON)
            })
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.post(`${contractURL}/interledger/create-payment`, requestOptions);

            // Return the paymentPointer to user
            return response.data;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async payInvoice(contractURL: string, action: string, paymentPointer: string, infoFields: Map<string, string>, priceInfo: PriceInfo, assetScale: number, orderHash: string): Promise<any>
    {
        const clientRequestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receiver: paymentPointer,
                amount: priceInfo.price * Math.pow(10, assetScale),
                orderHash: orderHash
            })
        }

        // Try to pay the invoice -- why cant moneyd be connected to?
        try
        {
            // Now data is set in contracts store -- send the payment request
            const paymentResponse: AxiosResponse = await axios.post(`${Config.moneydUrl}/actions/send`, clientRequestOptions);

            // If the payment response is success then the payment did not fail and the order is processed!

            // Return what? result?
            return paymentResponse;
        }
        catch (error)
        {
            console.error(error);
        }
    }

    public static async createPayPalPayment(contractURL: string, action: string, infoFields: Map<string, string>): Promise<any>
    {
        const infoFieldJSON: any = Array.from(
            infoFields.entries()
        )
        .reduce((o: any, [key, value]) => { 
            o[key] = value; 
    
            return o; 
        }, {});

        const requestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: action,
                infoFields: JSON.stringify(infoFieldJSON)
            })
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.post(`${contractURL}/paypal/create-payment`, requestOptions);

            // Return the paymentPointer to user
            return response.data;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }
}