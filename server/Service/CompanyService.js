import { executeQuery } from './db.js';
import { getQuery, getAllQuery } from './queries.js'


export class CompanyService {

    async getCompanies() {
        const queryGetCompanies = getAllQuery('companies', 'id, name');
        const companyResult = await executeQuery(queryGetCompanies);
        if (companyResult.length > 0) {
            return companyResult;
        }
        throw { status: 404, message: "No companies found" };
    }

    async getCompany(id) {
        const queryGetCompany = getQuery('companies', 'id = ?');
        const companyResult = await executeQuery(queryGetCompany, [id]);
        if (companyResult.length > 0) {
            return companyResult[0];
        }
        throw { status: 404, message: "No companies found" };
    }
}