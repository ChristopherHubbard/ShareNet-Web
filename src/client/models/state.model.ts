import { User } from './user.model';
import { Device, PriceInfo } from './device.model';

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
    loadingDevices?: boolean
    devices?: Array<Device>,
    error?: string,
    healthStates?: Map<string, boolean>,
    loadingHealthStates?: Map<string, boolean>
}

export interface DeviceConnectionState
{
    connected: boolean,
    connecting: boolean,
    searchedDevice: Device
    connectedDevice: Device,
    publicDevices: Array<Device>
}

export interface OrderPageState
{
    device: Device,
    actions: Array<string>,
    priceInfo: PriceInfo,
    assetScale: number,
    infoFields: Array<string>,
    canOrder: boolean,
    ordering: boolean,
    ordered: boolean,
    supportedMethods: Array<string>,
}