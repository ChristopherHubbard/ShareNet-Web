import { User } from "./user.model";
import { Device } from "./device.model";

// This IAction interface might want to be moved over to some interfaces folder
export interface IAction
{
    type: string,
    message?: string,
    error?: string,
    user?: User,
    devices?: Array<Device>
}