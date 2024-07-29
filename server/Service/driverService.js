import { executeQuery } from './db.js';
import { PasswordService } from './passwordService.js';
import { CompanyService } from './companyService.js'
import { LocationService } from './locationService.js'
import { addQuery, getDriverQuery, updateQuery, updateDriverQuery } from './queries.js'
import jwt from 'jsonwebtoken'
import global from './config.js';


export class DriverService {

    async signinDriver(driver) {
        const queryGetDriver = getDriverQuery('u.username = ?');
        const driverResult = await executeQuery(queryGetDriver, [driver.username]);
        if (driverResult.length > 0) {
            const passwordService = new PasswordService();
            const passwordResult = await passwordService.getPassword(driverResult[0].userId);
            if (passwordResult.password == driver.password) {
                let token = jwt.sign(driver, global.config.secretKey, {
                    algorithm: global.config.algorithm,
                    expiresIn: '1d'
                });
                return { token: token, id: driverResult[0].userId };
            }
        }
        throw { status: 401, message: "Authentication failed" };
    }

    async signupDriver(driver) {
        const queryAddUser = addQuery('users', "NULL, ?,'', 0, 0");
        const userResult = await executeQuery(queryAddUser, [driver.username]);
        if (userResult) {
            const passwordService = new PasswordService();
            await passwordService.addPassword(userResult.insertId, driver.password);
            let token = jwt.sign(driver, global.config.secretKey, {
                algorithm: global.config.algorithm,
                expiresIn: '1d'
            });
            return { token: token, id: userResult.insertId };
        }
        throw { status: 409, message: "Conflict occurred" };
    }


    async updateProfileDriver(driver, userId) {
        const { username, name, phoneNumber, companyId } = driver;
        const queryUpdateDriver = updateDriverQuery("username = ?, name = ?, phoneNumber = ?,companyId = ?", "userId = ?");
        const driverResult = await executeQuery(queryUpdateDriver, [username, name, phoneNumber, companyId, userId]);
        if (driverResult) {
            return driverResult;
        }
        throw { status: 404, message: "Driver not found" };
    }

    async updateDriver(driverDetails, userId) {
        const { name, phoneNumber, ...driver } = driverDetails;
        const queryUpdateUser = updateQuery('users', "name = ?, phoneNumber = ?, isActive = 1", "id = ?");
        const userResult = await executeQuery(queryUpdateUser, [name, phoneNumber, userId]);
        if (userResult) {
            const queryAddLocation = addQuery('locations', "NULL, 0, 0, 1");
            const locationResult = await executeQuery(queryAddLocation);
            const queryAddDriver = addQuery('drivers', "NULL, ?, ?, ?, 0, ?");
            const driverResult = await executeQuery(queryAddDriver, [userId, ...Object.values(driver), locationResult.insertId]);
            if (driverResult)
                return driverResult.insertId;
        }
        throw { status: 404, message: "Driver not found" };
    }

    async updateByUsername(value, username) {
        if (Object.keys(value)[0] == 'location') {
            const driver = await this.getDriver(username);
            const queryUpdateLocation = updateQuery('locations', 'latitude = ?, longitude = ?', 'id = ?');
            const locationResult = await executeQuery(queryUpdateLocation,
                [value.location.latitude, value.location.longitude, driver.locationId]);
            if (locationResult)
                return locationResult;
        }
        else {
            const queryUpdateDriver = updateDriverQuery(`${Object.keys(value)[0]} = ?`, 'u.username = ?');
            const driverResult = await executeQuery(queryUpdateDriver, [Object.values(value)[0], username]);
            if (driverResult)
                return driverResult;
        }
        throw { status: 404, message: "Driver not found" };
    }

    async updatePassword(value, id) {
        const passwordService = new PasswordService();
        const passwordResult = await passwordService.getPassword(id);
        if (passwordResult.password == value.oldPassword) {
            const queryUpdatePassword = updateQuery('passwords', `password = ?`, 'userId = ?');
            const newPasswordResult = await executeQuery(queryUpdatePassword, [value.newPassword, id]);
            if (newPasswordResult)
                return newPasswordResult;
        }
        throw { status: 404, message: "Driver not found" };
    }


    async getDriver(username) {
        const queryGetDriver = getDriverQuery('u.username = ?');
        const driverResult = await executeQuery(queryGetDriver, [username]);
        const companyService = new CompanyService();
        const companyResult = await companyService.getCompany(driverResult[0].companyId);
        const locationService = new LocationService();
        const locationResult = await locationService.getLocation(driverResult[0].companyId);
        if (driverResult.length > 0)
            return { ...driverResult[0], location: locationResult, company: companyResult };
        throw { status: 404, message: "Driver not found" };
    }

    async getAllDrivers() {
        const queryGetDriver = getDriverQuery('d.available = 1');
        const driverResult = await executeQuery(queryGetDriver);
        if (driverResult.length > 0)
            return driverResult;
        throw { status: 404, message: "No drivers found" };
    }
}