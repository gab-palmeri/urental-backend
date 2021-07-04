import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as stallService from '../services/stallService';
import { stallSchema } from '../schemas/StallSchema';

export class StallController {

    public async getStalls(req: Request, res: Response, next: any){

 		Promise.resolve(stallService.getStalls()).then(function(value) {

            if(value.code == undefined)
                res.status(200).send(value);
            else
                return next(createHttpError(value.httpError.code, value.httpError.message));
        });

    }

	public async createStall(req: Request, res: Response, next: any){

		var { error, value } = stallSchema.validate(req.body, {allowUnknown:true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        Promise.resolve(stallService.createStall(req.body)).then(function(httpError) {

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));
            else
                res.status(200).send();

        });

	}

}