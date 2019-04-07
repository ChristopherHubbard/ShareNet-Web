import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { User, Device, AccessType } from '../models';
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

    public static async get_public_devices(): Promise<any>
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
            // Await the response
            const response: AxiosResponse = await axios.get(`${Config.apiUrl}/devices/access`, requestOptions);

            // Return the devices that are in this access type
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
            body: device
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            await axios.post(`${Config.apiUrl}/devices`, requestOptions);
            return await this.get(device.owner as User);
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
            await axios.delete(`${Config.apiUrl}/devices`, requestOptions);

            // Return the updated devices for this user -- should another get request occur?
            return await this.get(device.owner as User);
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }
}