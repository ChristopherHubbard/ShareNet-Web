//Module imports
import * as Koa from "koa";
import * as combineRouters from "koa-combine-routers";
import { IndexRouter, UserRouter } from "./routers";

//The Server class
export class Server
{
    public app : Koa

    //Constuctor for the server
    public constructor()
    {
        //Create an ExpressJS application instance
        this.app = new Koa();

        //Configure the application
        this.Configure();

        //Add the routes
        this.Routes();
    }

    //Configure the Application
    public Configure()
    {
        //Add static paths -- needs to be updated for the different frontend methods
        //this.app.use(express.static(path.join(__dirname, "./views/Vue")));
        this.app.use(express.static(path.join(__dirname, "../../../../", "dist")));
    }

    private Routes()
    {
        // Attach all the routers
        const combinedRouter = combineRouters(
            new IndexRouter("This is the homepage router for client testing.").router,
            new UserRouter("This is the router to handle mocked user registration and login").router
        );
        
        //Use the router middleware -- use as many as necessary -- assign them their own base addresses for relative paths
        this.app.use(combinedRouter());
    }
}