"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Module imports
const Koa = require("koa");
const combineRouters = require("koa-combine-routers");
const serve = require("koa-static");
const routers_1 = require("./routers");
let path = require("path");
//The Server class
class Server {
    //Constuctor for the server
    constructor() {
        //Create an ExpressJS application instance
        this.app = new Koa();
        //Configure the application
        this.Configure();
        //Add the routes
        this.Routes();
    }
    //Configure the Application
    Configure() {
        //Add static paths -- needs to be updated for the different frontend methods
        //this.app.use(express.static(path.join(__dirname, "./views/Vue")));
        this.app.use(serve(path.join(__dirname, "../../../dist")));
    }
    Routes() {
        // Attach all the routers
        const combinedRouter = combineRouters(new routers_1.IndexRouter("This is the homepage router for client testing.").router, new routers_1.UserRouter("This is the router to handle mocked user registration and login").router);
        //Use the router middleware -- combine all the routers
        this.app.use(combinedRouter());
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map