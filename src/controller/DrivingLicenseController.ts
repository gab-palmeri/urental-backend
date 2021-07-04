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

		var drivingLicenseFlag:boolean = await hasDrivingLicense(decodedToken['id']);
		var response;

		if(drivingLicenseFlag)
			response = drivingLicenseUpdateSchema.validate(req.body);
		else 
			response = drivingLicenseSchema.validate(req.body);

        if(response.error != undefined)
            return next(createHttpError(400, response.error.details[0].message));

        Promise.resolve(drivingLicenseService.editOrCreate(decodedToken['id'], req.body)).then(function(httpError){

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));

            res.status(200).send();
        });
    }

}