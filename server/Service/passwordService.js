import { executeQuery } from "./db.js";
import { getQuery, addQuery } from './queries.js';

export class PasswordService {
    async getPassword(id) {
        const queryGetPassword = getQuery('passwords', 'userId = ?');
        const passwordResult = await executeQuery(queryGetPassword, [id]);
        if (passwordResult.length > 0)
            return passwordResult[0];
        throw { status: 404, message: "Password not found" };
    }

    async addPassword(id, password) {
        const queryAddPassword = addQuery('passwords', "NULL, ?, ?, 1");
        const passwordResult = await executeQuery(queryAddPassword, [id, password]);
        if (passwordResult)
            return passwordResult[0];
        throw { status: 409, message: "Conflict occurred" };
    }

}