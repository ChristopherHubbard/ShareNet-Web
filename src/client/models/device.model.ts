import { User } from "./user.model";

// Enums for the access type and the device categories -- Could be more complex access types later
export enum AccessType
{
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}

export enum DeviceCategory
{
    COMPUTE = 'COMPUTE',
    STORAGE = 'STORAGE',
    TRANSPORTATION = 'TRANSPORTATION',
    FOOD_AND_DRINK = 'FOOD AND DRINK'
}

export interface Device
{
    name: string,
    owner?: User,
    code: string,
    contractURL: string,
    accessType: AccessType,
    deviceCategory: DeviceCategory
}

export interface PriceInfo
{
    price: number,
    baseCurrency: string
}