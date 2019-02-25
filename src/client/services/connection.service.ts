import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import Config from '../config';

// Abstract since totally static class
export abstract class ConnectionService
{
    // Static async method to get all the companies
    public static async get(code: string): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                code: code
            }
        };

        // Try catch for the new Async-Await structure
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${Config.apiUrl}/connect`, requestOptions);

            // Return the devices for this user
            return response.data.device;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }
}