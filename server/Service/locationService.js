import { executeQuery } from './db.js';
import { addQuery, getQuery } from './queries.js'

export class LocationService {


    async addLocation(location) {
        const queryAddLocation = addQuery('locations', 'NULL,?,?,1');
        const result = await executeQuery(queryAddLocation, Object.values(location));
        return result;
    }

    async getLocation(id) {
        const queryGetLocation = getQuery('locations', 'id = ?');
        const result = await executeQuery(queryGetLocation, [id]);
        return result[0];
    }
}