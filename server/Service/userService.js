import { executeQuery } from './db.js';
import { PasswordService } from './passwordService.js';
import { addQuery, getQuery, updateQuery } from './queries.js'
import jwt from 'jsonwebtoken'
import global from './config.js';


export class UserService {

    async signinUser(user) {
        const queryGetUser = getQuery('users', ' username = ?');
        const userResult = await executeQuery(queryGetUser, [user.username]);
        if (userResult.length > 0) {
            const passwordService = new PasswordService();
            const passwosrResult = await passwordService.getPassword(userResult[0].id);
            if (passwosrResult.password == user.password) {
                let token = jwt.sign(user, global.config.secretKey, {
                    algorithm: global.config.algorithm,
                    expiresIn: '1d'
                });
                return { token: token, id: userResult[0].id };
            }
        }
        throw { status: 401, message: "Authentication failed" };
    }


    async signupUser(user) {
        const queryGetUser = addQuery('users', "NULL, ?,'', 0, 1");
        const userResult = await executeQuery(queryGetUser, [user.username]);
        if (userResult) {
            const passwordService = new PasswordService();
            await passwordService.addPassword(userResult.insertId, user.password);
            let token = jwt.sign(user, global.config.secretKey, {
                algorithm: global.config.algorithm,
                expiresIn: '1d'
            });
            return { token: token, id: userResult.insertId };
        }
        throw { status: 409, message: "Conflict occurred" };
    }

    async getUserByUsername(username) {
        const queryGetUser = getQuery('users', ' username = ?');
        const userResult = await executeQuery(queryGetUser, [username]);
        if (userResult.length > 0)
            return userResult[0];
        throw { status: 404, message: "User not found" };
    }

    async getUserById(id) {
        const queryGetUser = getQuery('users', ' id = ?');
        const userResult = await executeQuery(queryGetUser, [id]);
        if (userResult.length > 0)
            return userResult[0];
        throw { status: 404, message: "User not found" };
    }

    async updateUser(user, userId) {
        let valuesToUpdate = "";
        Object.keys(user).forEach(key => { valuesToUpdate += key += "= ?," });
        valuesToUpdate = valuesToUpdate.slice(0, -1);
        const queryUpdateUser = updateQuery('users', valuesToUpdate, " id = ?");
        const userResult = await executeQuery(queryUpdateUser, [...Object.values(user), userId]);
        if (userResult)
            return userResult;
        throw { status: 404, message: "User not found" };
    }
}