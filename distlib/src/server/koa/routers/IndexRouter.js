"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sender = require("koa-send");
const CustomRouter_1 = require("./CustomRouter");
// Defines the routes used at the index of the application
class IndexRouter extends CustomRouter_1.CustomRouter {
    // Implement the route creating method
    CreateRoutes() {
        //Add home page route
        this.router.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
            // Send back the index HTML
            yield sender(ctx, ctx.path, {
                root: __dirname + "/index.html"
            });
        }));
    }
}
exports.IndexRouter = IndexRouter;
//# sourceMappingURL=IndexRouter.js.map