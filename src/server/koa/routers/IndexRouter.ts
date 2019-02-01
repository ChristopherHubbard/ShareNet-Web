// Import base route class
import { CustomRouter } from "./CustomRouter";

const sender: any = require('koa-send');

// Defines the routes used at the index of the application
export class IndexRouter extends CustomRouter
{
    // Implement the route creating method
    protected CreateRoutes(): void
    {
        //Add home page route
        this.router.get('/', async (ctx) =>
        {
            // This will serve the files from the directory specified -- should 
            let dist: string = './dist'
            await sender(ctx, ctx.path, {
                root: __dirname + dist
            });
        });
    }
}