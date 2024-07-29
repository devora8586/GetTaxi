import express from "express";
import { OrderController } from '../Controller/orderController.js'
import { orderSchema } from '../MiddleWare/validators.js'
import { validate } from "../MiddleWare/validate.js";
import { verifyToken } from "../MiddleWare/verifyToken.js";


const orderRouter = express.Router();
const orderController = new OrderController()
orderRouter.post("/", validate(orderSchema), verifyToken, orderController.addOrder)
orderRouter.delete("/:id", verifyToken, orderController.deleteOrder)
orderRouter.patch("/:id", verifyToken, orderController.updateOrder)

export {
     orderRouter
}