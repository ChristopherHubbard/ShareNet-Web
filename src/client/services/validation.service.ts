import { FormErrors } from "redux-form";
import { User } from '../models';

export const required = (value: any) => 
{
    if (value === undefined)
    {
        return 'Required';
    }
}

export const validatePassword = (value: any) =>
{
    if (value.length < 10)
    {
        return 'Must be at least 10 characters';
    }
}

export const validateEmail = (value: any) =>
{
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
    {
        return 'Invalid Email'
    }
}