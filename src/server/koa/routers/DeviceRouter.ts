import { Context, Request } from "koa";

// Import base route class
import { CustomRouter } from "./CustomRouter";

// Temp data store
let devices: Array<any> = [];

// Defines the routes used at the index of the application
export class DeviceRouter extends CustomRouter
{
    // Implement the route creating method
    protected CreateRoutes(): void
    {
        this.router.post('/devices', async (ctx: any): Promise<any> =>
        {
            // Hash and salt the password -- make sure all the info arrived
            const device = ctx.request.body.body;

            devices.push(device)

            ctx.body = {
                devices: devices
            };
        });

        this.router.get('/devices', async (ctx: Context): Promise<any> =>
        {
            ctx.body = {
                devices: devices
            };
            ctx.status = 200;
        });

        this.router.delete('/devices', async (ctx: any): Promise<any> =>
        {
            const code = ctx.request.body.code;
            devices = devices.filter((el) => el.code !== code);
            ctx.body = {
                devices: devices
            };
            ctx.status = 200;
        });
    }
}