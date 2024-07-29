import express from "express";
import { DriverController } from '../Controller/driverController.js'
import { verifyToken } from '../MiddleWare/verifyToken.js'
import { initialDetailsSchema, updateDriverSchema } from "../MiddleWare/validators.js";
import { validate } from "../MiddleWare/validate.js";

const driverRouter = express.Router();

const driverController = new DriverController()
driverRouter.get("/:username", driverController.getDriver)
driverRouter.post("/signin", validate(initialDetailsSchema), driverController.signinDriver)
driverRouter.post("/signup", validate(initialDetailsSchema), driverController.signupDriver)
driverRouter.put("/:id", validate(updateDriverSchema), verifyToken, driverController.updateByDriverId)
driverRouter.patch("/:username",  verifyToken, driverController.updateByUsername)

export {
    driverRouter
}