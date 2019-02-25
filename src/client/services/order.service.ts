import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// Abstract since totally static class
export abstract class OrderService
{
    public static async getActions(contractURL: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
            params: {}
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${contractURL}/info`, requestOptions);

            // Return the devices for this user
            return response.data.info;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async getPriceInfo(contractURL: string, action: string): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                action: action
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

    public static async getCanOrder(contractURL: string, action: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
}