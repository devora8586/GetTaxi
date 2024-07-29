import express from "express";
import { CompanyController } from '../Controller/companyController.js'

const companyRouter = express.Router();

const companyController = new CompanyController()
companyRouter.get("/", companyController.getCompanies)

export {
    companyRouter
}