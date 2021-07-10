import { Request, Response } from 'express';

import createHttpError from 'http-errors';

import { statusSchema, statusUpdateSchema } from "../schemas/StatusSchema";

import * as statusService from '../services/statusService';
import * as staffService from "../services/staffService";
import { getBookingBy } from "../services/bookingService";
import fs from "fs";
import * as jwt from "jsonwebtoken";

export class StatusController {

    public async editOrCreate(req: Request, res: Response, next: any) {

        let publicKEY = fs.readFileSync('./keys/public.key', 'utf8');
        let decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], publicKEY);

        if (decodedToken["role"] != 2)
            return {code: 401, message: "Non hai i permessi per effettuare questa richiesta"};


        if (req.body.bookingID == undefined)
            return next(createHttpError(400, "bookingID non presente"));


        let {httpError, booking} = await Promise.resolve(getBookingBy(req.body.bookingID));
        if (httpError != undefined)
            return next(createHttpError(httpError.code, httpError.message));

        delete req.body.bookingID;


        let result = await Promise.resolve(staffService.getStaffBy(decodedToken["id"]));
        if (result.httpError != undefined)
            return next(createHttpError(result.httpError.code, result.httpError.message));


        var response;

        if (booking.status != undefined) {
            response = statusUpdateSchema.validate(req.body);
            req.body.staffDelivery = decodedToken["id"];
        } else {
            response = statusSchema.validate(req.body);
            req.body.staffPickup = decodedToken["id"];
        }

        if (response.error != undefined)
            return next(createHttpError(400, response.error.details[0].message));


        Promise.resolve(statusService.editOrCreate(booking, req.body)).then(function (value) {

            if (value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

            res.status(200).send();
        });
    }
}