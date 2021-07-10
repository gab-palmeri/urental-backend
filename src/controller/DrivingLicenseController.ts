import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as drivingLicenseService from "../services/drivingLicenseService";
import { hasDrivingLicense } from "../services/userService";

import { drivingLicenseSchema, drivingLicenseUpdateSchema } from "../schemas/DrivingLicenseSchema";
import * as tokenService from '../services/tokenService';

export class DrivingLicenseController{

    public async editOrCreate(req: Request, res: Response, next: any){

		let decodedID = tokenService.getIDBy(req.headers.authorization.split(" ")[1]);

		var drivingLicenseFlag = await hasDrivingLicense(decodedID);
		if(drivingLicenseFlag.httpError != undefined)
			return next(createHttpError(drivingLicenseFlag.httpError.code, drivingLicenseFlag.httpError.message));

		var response;

		if(drivingLicenseFlag.hasDrivingLicense)
			response = drivingLicenseUpdateSchema.validate(req.body);
		else 
			response = drivingLicenseSchema.validate(req.body);

        if(response.error != undefined)
            return next(createHttpError(400, response.error.details[0].message));

        Promise.resolve(drivingLicenseService.editOrCreate(decodedID, req.body)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

            res.status(200).send();
        });
    }

	public async delete(req: Request, res: Response, next:any)
	{
		let decodedID = tokenService.getIDBy(req.headers.authorization.split(" ")[1]);

        Promise.resolve(drivingLicenseService.deleteLicense(decodedID)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

            res.status(200).send();
        });
		
	}

}