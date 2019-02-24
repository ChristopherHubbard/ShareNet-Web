import { Context, Request } from "koa";

// Import base route class
import { CustomRouter } from "./CustomRouter";
import { createContext } from "../../../../node_modules/@types/react";

// Defines the routes used at the index of the application
export class OrderRouter extends CustomRouter
{
    // Implement the route creating method
    protected CreateRoutes(): void
    {
        this.router.get('/actions', async (ctx: Context): Promise<any> =>
        {
            ctx.body = {
                actions: ['Whiskey Coke', 'Vodka Soda']
            };
            ctx.status = 200;
        });

        this.router.get('/info', async (ctx: any): Promise<any> =>
        {
            ctx.body = {
                info: ['destination number']
            };
            ctx.status = 200;
        });

        this.router.get('/priceInfo', async (ctx: any): Promise<any> =>
        {
            ctx.body = {
                priceInfo: {
                    price: 10,
                    baseCurrency: 'XRP'
                }
            };
            ctx.status = 200;
        });

        this.router.get('/canOrder', async (ctx: any): Promise<any> =>
        {
            ctx.body = {
                canOrder: true
            };
            ctx.status = 200;
        });
    }
}