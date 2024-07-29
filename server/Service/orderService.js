import { executeQuery } from './db.js';
import { addQuery, deleteQuery, updateQuery, getIdQuery } from './queries.js'
import { LocationService } from './locationService.js';
import { DriverService } from './driverService.js';
import { UserService } from './userService.js';

function calcDistance(x, y) {
    return Math.sqrt(Math.pow(x.latitude - y.latitude, 2) + Math.pow(x.longitude - y.longitude, 2));
}

async function calcNearestTaxiDrivers(drivers, order) {
    let nearestTaxiDrivers = [];
    const locationService = new LocationService();
    for (let driver of drivers) {
        const driverLocation = await locationService.getLocation(driver.locationId);
        const distance = calcDistance(order.location, driverLocation);
        if (nearestTaxiDrivers.length < 5)
            nearestTaxiDrivers.push(driver);
        else
            for (let taxiDriver of nearestTaxiDrivers) {
                const taxiDriverLocation = await locationService.getLocation(taxiDriver.locationId);
                const distanceToCompare = calcDistance(order.location, taxiDriverLocation);
                if (distance < distanceToCompare) {
                    nearestTaxiDrivers.splice(nearestTaxiDrivers.indexOf(taxiDriver), 1);
                    nearestTaxiDrivers.push(driver);
                    break;
                }
            }
    }
    return nearestTaxiDrivers;
}


export class OrderService {

    async addOrder(order) {
        const locationService = new LocationService();
        const locationResult = await locationService.addLocation(order.location);
        const destinationResult = await locationService.addLocation(order.destination);
        const driverService = new DriverService();
        const driverResult = await driverService.getAllDrivers();
        const nearestTaxiDrivers = await calcNearestTaxiDrivers(driverResult, order)
        if (nearestTaxiDrivers.length == 0)
            throw { status: 417, message: "Available drivers not found" }
        const userService = new UserService();
        const user = await userService.getUserById(order.userId)
        const queryAddOrder = addQuery('orders', 'NULL, ?, ?, NULL, ?, 1');
        const orderResult = await executeQuery(queryAddOrder, [locationResult.insertId, destinationResult.insertId, order.userId]);
        return { nearestTaxiDrivers: nearestTaxiDrivers, order: { ...order, id: orderResult.insertId, contactPhone: user.phoneNumber } };
    }

    async updateOrder(id, value) {
        const driverQuery = getIdQuery('drivers', 'userId = ?')
        const driverResult = await executeQuery(driverQuery, [value.driverId])
        const queryUpdateOrder = updateQuery('orders', `driverId = ?`, 'id = ?');
        const orderResult = await executeQuery(queryUpdateOrder, [driverResult[0].id, id]);
        if (orderResult.affectedRows)
            return orderResult;
        throw { status: 404, message: "Order not found" };
    }

    async deleteOrder(id) {
        const queryAddOrder = deleteQuery('orders');
        const orderResult = await executeQuery(queryAddOrder, [id]);
        if (orderResult.affectedRows > 0)
            return orderResult;
        throw { status: 404, message: "Order not found" };
    }
}