import { User } from "./user.model";
import { Device, PriceInfo } from "./device.model";
import { Receipt } from "ilp";

// This IAction interface might want to be moved over to some interfaces folder
export interface IAction
{
    type: string
    message?: string
    error?: string
    user?: User
    devices?: Array<Device>
    publicDevices?: Array<Device>
    device?: Device
    searchedDevice?: Device
    actions?: Array<string>
    canOrder?: boolean
    priceInfo?: PriceInfo
    assetScale?: number
    info?: Array<string>
    paymentPointer?: string
    receipt?: Receipt,
    supportedMethods?: Array<string>,
    orderHash?: string,
    health?: boolean
}