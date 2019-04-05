import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { User } from '../models';
import Config from '../config';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: Config.cognito.REGION,
        userPoolId: Config.cognito.USER_POOL_ID,
        userPoolWebClientId: Config.cognito.APP_CLIENT_ID
    }
});

// Abstract since totally static class
export abstract class UserService
{
    // Static async method to register a user (Put in DB) given info (should be validated)
    public static async register(user: User): Promise<any>
    {
        try
        {
            // Await the response -- shouldn't be any returned data for the post
            // return await axios.post(`${Config.apiUrl}/users/register`, requestOptions);
            return await Auth.signUp({
                username: user.email,
                password: user.password as string,
                attributes: {
                    'custom:firstname': user.firstname,
                    'custom:lastname': user.lastname
                }
            });
        }
        catch(error)
        {
            // Log any error
            console.error(error);
        }
    }

    // Static async method to login with user and password -- should probably have better return type here
    public static async login(user: User, checked: boolean): Promise<any>
    {
        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response -- Call Cognito instead?
            const response: any = await Auth.signIn(user.email, user.password);

            // Check for the response token -- this proves authentication
            const resUser: User = <User> {
                email: response.attributes.email,
                firstname: response.attributes['custom:firstname'],
                lastname: response.attributes['custom:lastname'],
                email_verified: response.attributes.email_verified
            };

            if (resUser && checked)
            {
                // Add the user to the localStorage
                localStorage.setItem('user', JSON.stringify(resUser));
            }
            else if (user)
            {
                sessionStorage.setItem('user', JSON.stringify(resUser));
            }

            // Return the user -- not necessarily authenticated
            return resUser;
        }
        catch(error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async logout(): Promise<void>
    {
        // Remove the user from the localStorage
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        // Invalidate the Auth token
        await Auth.signOut();
    }
}