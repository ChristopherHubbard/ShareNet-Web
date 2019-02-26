import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { User, Device } from '../models';
import Config from '../config';

// Abstract since totally static class
export abstract class DeviceService
{
    // Static async method to get all the companies
    public static async get(user: User): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: user
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${Config.apiUrl}/devices`, requestOptions);

            // Return the devices for this user
            return response.data.devices;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async add(device: Device): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(device)
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.post(`${Config.apiUrl}/devices`, requestOptions);

            // Return the updated devices for this user -- should another get request occur?
            return response.data.devices;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async remove(device: Device): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(device)
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.delete(`${Config.apiUrl}/devices`, requestOptions);

            // Return the updated devices for this user -- should another get request occur?
            return response.data.devices;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }
}