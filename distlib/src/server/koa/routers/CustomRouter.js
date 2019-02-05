"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Module imports
const Router = require("koa-router");
//Route Class
class CustomRouter {
    //Constructor
    constructor(title) {
        this.title = title;
        this.router = new Router();
        // Create the routes? Should be defined in the sub class, so this should call that method?
        this.CreateRoutes();
    }
}
exports.CustomRouter = CustomRouter;
//# sourceMappingURL=CustomRouter.js.map