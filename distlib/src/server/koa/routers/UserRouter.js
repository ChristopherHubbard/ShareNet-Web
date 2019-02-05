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
// Import base route class
const CustomRouter_1 = require("./CustomRouter");
// Temp data store
let users = [];
// Defines the routes used at the index of the application
class UserRouter extends CustomRouter_1.CustomRouter {
    // Implement the route creating method
    CreateRoutes() {
        this.router.post('/register', (ctx) => __awaiter(this, void 0, void 0, function* () {
            // Hash and salt the password -- make sure all the info arrived
            const user = ctx.body;
            if (user.username === '' || user.password === '' || user.phone === '' || user.email === '') {
                // Send no authorization response
            }
            else {
                // Save user to the DB
                users.push(user);
            }
        }));
        this.router.get('/authenticate', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield 1;
        }));
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=UserRouter.js.map