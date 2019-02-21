import { Context, Request } from "koa";

// Import base route class
import { CustomRouter } from "./CustomRouter";

// Temp data store
let users: Array<any> = [];

// Defines the routes used at the index of the application
export class UserRouter extends CustomRouter
{
    // Implement the route creating method
    protected CreateRoutes(): void
    {
        this.router.post('/register', async (ctx: any): Promise<any> =>
        {
            // Hash and salt the password -- make sure all the info arrived
            const user = ctx.request.body.body;

            if (user.email === '' || user.password === '' || user.firstname === '' || user.lastname === '')
            {
                // Send no authorization response
                ctx.status = 404;
            }
            else
            {
                // Save user to the DB
                users.push(user);
                ctx.body = user;
                ctx.status = 200;
            }
        });

        this.router.get('/login', async (ctx: Context): Promise<any> =>
        {
            if (users.find(((user: any) => user.email === ctx.query.email && user.password === ctx.query.password)))
            {
                ctx.body = ctx.query;
                ctx.status = 200;
            }
        });
    }
}