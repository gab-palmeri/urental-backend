import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as driverService from "../services/driverService";
import { staffAndDriverSchema as driverSchema } from "../schemas/StaffAndDriverSchema";

export class DriverController{

    public async auth(req: Request, res: Response, next: any){

        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        Promise.resolve(driverService.authDriver(req.body.email, req.body.password)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.error, value.httpError.message));

            res.status(200).send({
                "token": value.token,
            });
        });
    }

	 public async create(req: Request, res: Response, next: any){

        let { error, value } = driverSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        Promise.resolve(driverService.createDriver(req)).then(function(httpError){

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));

            res.status(200).send();
        });
    }
}