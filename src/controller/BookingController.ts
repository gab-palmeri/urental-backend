import { Booking } from "../entity/Booking";
import { Request, Response } from "express";
import createHttpError from "http-errors";
import { getRepository } from "typeorm";

import * as bookingService from '../services/bookingService';
import * as driverService from '../services/driverService';

export class BookingController{

    public async createBooking(req: Request, res: Response, next: any){

		//Effettua il pagamento (carta di credito)
		//Inserire gli stalli di consegna/ritiro
		//Impostare dati di consegna
		//Impostare dati di ritiro
		//Impostare ore

		//Se ha un driver, assegna un driver a questa prenotazione
    }

	public async checkAvailability(req: Request, res: Response, next: any){

		//Argomenti body: pickUpDateTime, deliveryDateTime, driver, seriale

        Promise.resolve(bookingService.checkAvailability(req.body)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.error, value.httpError.message));

			if(!value.availability)
				res.status(200).send({
					"available": value.availability
				});

			if(req.body.driver == true)
				Promise.resolve(driverService.checkAvailability(req.body)).then(function(secondValue){

					if(secondValue.httpError != undefined)
                		return next(createHttpError(value.httpError.error, value.httpError.message));

					res.status(200).send({
						"available": value.availability && secondValue.availability
					});

					return;
					
				});
			else
				res.status(200).send({
					"available": value.availability
				});
			
            
        });



	}
}

/* driver: TRUE/FALSE

pickUpDateTime

deliveryDateTime

hours

cardNumber
expirationDate
cvv
total

pickUpStall
deliveryStall */ 