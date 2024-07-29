import { CompanyService } from "../Service/CompanyService.js";

export class CompanyController {

    async getCompanies(req, res, next) {
        try {
            const companyService = new CompanyService();
            const result = await companyService.getCompanies();
            res.json(result);
        }
        catch (ex) {
            const err = {}
            err.statusCode = ex.status == undefined ? 500 : ex.status;
            err.message = ex.message == undefined ? ex : ex.message;
            next(err);
        }
    }

}