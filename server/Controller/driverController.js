import { DriverService } from "../Service/driverService.js";

export class DriverController {
    async signinDriver(req, res, next) {
        try {
            const driverService = new DriverService();
            const result = await driverService.signinDriver(req.body);
            return res.cookie('token', result.token, { secure: false, httpOnly: true }).json(result.id)
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async signupDriver(req, res, next) {
        try {
            const driverService = new DriverService();
            const result = await driverService.signupDriver(req.body);
            return res.cookie('token', result.token, { secure: false, httpOnly: true }).json(result.id)

        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async updateByDriverId(req, res, next) {
        try {
            const driverService = new DriverService();
            let result
            if (req.body.idNumber)
                result = await driverService.updateDriver(req.body, req.params['id']);
            if (req.body.oldPassword)
                result = await driverService.updatePassword(req.body, req.params['id']);
            else
                result = await driverService.updateProfileDriver(req.body, req.params['id']);
            res.json(result);
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async updateByUsername(req, res, next) {
        try {
            const driverService = new DriverService();
            const result = await driverService.updateByUsername(req.body, req.params['username']);
            res.json(result);
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

    async getDriver(req, res, next) {
        try {
            const driverService = new DriverService();
            const result = await driverService.getDriver(req.params['username']);
            res.json(result);
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }
}