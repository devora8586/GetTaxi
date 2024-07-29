import { OrderService } from "../Service/orderService.js";

export class OrderController {

    async addOrder(req, res, next) {
        try {
            const orderService = new OrderService();
            const result = await orderService.addOrder(req.body);
            res.json(result);
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err)
        }
    }

    async deleteOrder(req, res, next) {
        try {
            const orderService = new OrderService();
            await orderService.deleteOrder(req.params.id);
            res.json({ status: 200 });
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err)
        }
    }

    async updateOrder(req, res, next) {
        try {
            const orderService = new OrderService();
            await orderService.updateOrder(req.params.id, req.body);
            res.json({ status: 200 });
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err)
        }
    }

}