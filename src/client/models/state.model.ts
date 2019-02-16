import { User } from './user.model';
import { Device } from './device.model';

export interface LoginState
{
    loggedIn?: boolean,
    loggingIn?: boolean,
    user?: User
}

export interface RegistrationState
{
    registering?: boolean,
    registered?: boolean
}

export interface DeviceState
{
    devices?: Array<Device>
}