import { Request, Response } from 'express';

import createHttpError from 'http-errors';

import { statusSchema, statusUpdateSchema } from "../schemas/StatusSchema";

import * as statusService from '../services/statusService';
import * as staffService from "../services/staffService";
import * as tokenService from '../services/tokenService';
import * as userService from '../services/userService';

import { getBookingBy } from "../services/bookingService";

export class StatusController {

    public async editOrCreate(req: Request, res: Response, next: any) {

		let decodedToken = tokenService.decodeToken(req.headers.authorization.split(" ")[1])
		
		if(decodedToken.httpError != undefined)
			return next(createHttpError(decodedToken.httpError.code, decodedToken.httpError.message));

        if (decodedToken.token["role"] != 2)
            return next(createHttpError(401, "Non hai i permessi per effettuare questa richiesta"));
		
        if (req.body.bookingID == undefined)
            return next(createHttpError(400, "bookingID non presente"));

        let {httpError, booking} = await Promise.resolve(getBookingBy(req.body.bookingID));
        if (httpError != undefined)
            return next(createHttpError(httpError.code, httpError.message));

        delete req.body.bookingID;

		
        let result = await Promise.resolve(staffService.getStaffBy(decodedToken.token["id"]));
        if (result.httpError != undefined)
            return next(createHttpError(result.httpError.code, result.httpError.message));

        var response;

        if (booking.status != undefined) {
            response = statusUpdateSchema.validate(req.body);
            req.body.staffDelivery = decodedToken.token["id"];
        } else {
            response = statusSchema.validate(req.body);
            req.body.staffPickup = decodedToken.token["id"];
        }

        if (response.error != undefined)
            return next(createHttpError(400, response.error.details[0].message));


        Promise.resolve(statusService.editOrCreate(booking, req.body)).then(function (value) {

            if (value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

			if(value.booking.status.staffDelivery == undefined)
			{
				//Calculate the time between the delivery time (plus a margin) and the actual time
				const deliveryDateTimeWithMargin = new Date(booking.deliveryDateTime.getTime() + 0*60000);
				const time = deliveryDateTimeWithMargin.getTime() - new Date().getTime();

				//After that time has elapsed, check if the vehicle has already been delivered: if not, the user is late
				setTimeout(async () => {

					let {httpError, booking} = await Promise.resolve(getBookingBy(value.booking.id));

					if(httpError != undefined)
					{
						console.log(httpError);
						return;
					}

					if(booking.status.staffDelivery == undefined)
						userService.sendLateMail(booking);
					else 
						console.log("no late");

				}, time); //<-- previosuly declared time usage
			}

            res.status(200).send();
        });
    }
}