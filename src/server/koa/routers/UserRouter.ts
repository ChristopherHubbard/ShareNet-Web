import { Context } from "koa";

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
        this.router.post('/register', async (ctx: Context): Promise<any> =>
        {
            // Hash and salt the password -- make sure all the info arrived
            const user = ctx.body;

            if (user.username === '' || user.password === '' || user.phone === '' || user.email === '')
            {
                // Send no authorization response
            }
            else
            {
                // Save user to the DB
                users.push(user);
            }
        });

        this.router.get('/authenticate', async (ctx: Context): Promise<any> =>
        {
            await 1
        });
    }
}