import { UserService } from "../Service/userService.js";

export class UserController {

    async signinUser(req, res, next) {
        try {
            const userService = new UserService();
            const result = await userService.signinUser(req.body);
            return res.cookie('token', result.token, { secure: false, httpOnly: true }).json(result.id)
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async signupUser(req, res, next) {
        try {
            const userService = new UserService();
            const result = await userService.signupUser(req.body);
            return res.cookie('token', result.token, { secure: false, httpOnly: true }).json(result.id)
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async getUser(req, res, next) {
        try {
            const userService = new UserService();
            const result = await userService.getUserByUsername(req.params['username']);
            res.json(result);
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async updateUser(req, res, next) {
        try {
            const userService = new UserService();
            const result = await userService.updateUser(req.body, req.params['id']);
            res.json(result)
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }
}