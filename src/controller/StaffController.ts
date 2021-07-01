import { Request, Response } from "express";
import createHttpError from "http-errors";

import { staffAndDriverSchema as StaffSchema} from "../schemas/StaffAndDriverSchema";

import * as staffService from "../services/staffService";

export class StaffController{

    public async auth(req: Request, res: Response, next: any){

        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        Promise.resolve(staffService.authStaff(req.body.email, req.body.password)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.error, value.httpError.message));

            res.status(200).send({
                "token": value.token,
            });
        });
    }

    public async create(req: Request, res: Response, next: any){

        let { error, value } = StaffSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        Promise.resolve(staffService.createStaff(req)).then(function(httpError){

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));

            res.status(200).send();
        });
    }
}