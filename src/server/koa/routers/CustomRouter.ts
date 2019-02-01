//Module imports
import * as Router from "koa-router"

//Route Class
export abstract class CustomRouter
{
    public router: Router;

    protected title : string;

    //Constructor
    public constructor(title : string)
    {
        this.title = title;
        this.router = new Router();

        // Create the routes? Should be defined in the sub class, so this should call that method?
        this.CreateRoutes();
    }

    // Method required to be implemented by the class to define the routes that the router uses
    protected abstract CreateRoutes(): void
}