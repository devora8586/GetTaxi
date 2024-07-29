import express from "express";
import { UserController } from '../Controller/userController.js'
import { verifyToken } from "../MiddleWare/verifyToken.js";
import { initialDetailsSchema, updateUserSchema } from "../MiddleWare/validators.js";
import { validate } from "../MiddleWare/validate.js";

const userRouter = express.Router();

const userController = new UserController()
userRouter.get("/:username", verifyToken, userController.getUser)
userRouter.post("/signin", validate(initialDetailsSchema), userController.signinUser)
userRouter.post("/signup", validate(initialDetailsSchema), userController.signupUser)
userRouter.put("/:id", validate(updateUserSchema), verifyToken, userController.updateUser)

export {
    userRouter
}