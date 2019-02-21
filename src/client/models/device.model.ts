import { User } from "./user.model";

export interface Device
{
    name: string,
    owner: User,
    code: string,
    contractURL: string
}