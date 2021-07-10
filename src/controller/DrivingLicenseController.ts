import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import * as drivingLicenseService from "../services/drivingLicenseService";
import { hasDrivingLicense } from "../services/userService";

import { drivingLicenseSchema, drivingLicenseUpdateSchema } from "../schemas/DrivingLicenseSchema";

export class DrivingLicenseController{

    public async editOrCreate(req: Request, res: Response, next: any){

		let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    	let decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], publicKEY);

		var drivingLicenseFlag = await hasDrivingLicense(decodedToken['id']);
		if(drivingLicenseFlag.httpError != undefined)
			return next(createHttpError(drivingLicenseFlag.httpError.code, drivingLicenseFlag.httpError.message));

		var response;

		if(drivingLicenseFlag.hasDrivingLicense)
			response = drivingLicenseUpdateSchema.validate(req.body);
		else 
			response = drivingLicenseSchema.validate(req.body);

        if(response.error != undefined)
            return next(createHttpError(400, response.error.details[0].message));

        Promise.resolve(drivingLicenseService.editOrCreate(decodedToken['id'], req.body)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

            res.status(200).send();
        });
    }

	public async delete(req: Request, res: Response, next:any)
	{
		let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    	let decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], publicKEY);

        Promise.resolve(drivingLicenseService.deleteLicense(decodedToken['id'])).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

            res.status(200).send();
        });
		
	}

}