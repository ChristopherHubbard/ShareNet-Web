// Import base route class
import { Context } from "koa";
import * as sender from "koa-send";
import { CustomRouter } from "./CustomRouter";

// Defines the routes used at the index of the application
export class IndexRouter extends CustomRouter
{
    // Implement the route creating method
    protected CreateRoutes(): void
    {
        //Add home page route
        this.router.get('/', async (ctx: Context): Promise<any> =>
        {
            // Send back the index HTML
            await sender(ctx, ctx.path, {
                root: __dirname + "/index.html"
            });
        });
    }
}