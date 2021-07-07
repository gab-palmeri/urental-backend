import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as bookingService from '../services/bookingService';
import * as driverService from '../services/driverService';
import * as stallService from '../services/stallService';
import * as vehicleService from '../services/vehicleService';
import * as userService from '../services/userService';

import { creditCardSchema } from "../schemas/CreditCardSchema";
import { bookingSchema } from "../schemas/BookingSchema";

import { Payer } from "../payer";

export class BookingController{

    public async createBooking(req: Request, res: Response, next: any){

		//PARTE VALIDAZIONE
		var { error, value } = creditCardSchema.validate(req.body.creditCard);

		if(error != undefined)
			return next(createHttpError(400, error.details[0].message));

		({error, value} = bookingSchema.validate(req.body.booking));

		if(error != undefined)
			return next(createHttpError(400, error.details[0].message));

		//Effettua il pagamento (carta di credito) - simulato
		if(!Payer.pay(req.body.creditCard, req.body.total))
			return next(createHttpError(400, "Pagamento non effettuato. Riprova più tardi"));
		
		//STALLI, MACCHINA
		var array_of_functions = [
    		function():Promise<any> { return stallService.getBookingStalls(req.body.booking.pickUpStall, req.body.booking.deliveryStall) },
			function():Promise<any> { return vehicleService.getVehicle(req.body.booking.serialNumber) }
		]

		//SE C'è DRIVER, AGGIUNGI
		if(req.body.booking.driver)
			array_of_functions.push(function():Promise<any> { return driverService.getAvailableDriver(req.body.booking.pickUpDateTime, req.body.booking.deliveryDateTime) })

		
		Promise.all(array_of_functions.map(func => func())).then(async response => {

			//ERROR CHECKING
			if(response[0].httpError != undefined)
                return next(createHttpError(response[0].httpError.error, response[0].httpError.message));
			if(response[1].httpError != undefined)
                return next(createHttpError(response[1].httpError.error, response[1].httpError.message));
			if(response[2] && response[2].httpError != undefined)
                return next(createHttpError(response[2].httpError.error, response[2].httpError.message));

			var driver = undefined;
			if(response[2])
				driver = response[2].driver;

			Promise.resolve(
				bookingService.createBooking(
					req.body.booking.pickUpDateTime, 
					response[0].stalls.pickUpStall, 
					req.body.booking.deliveryDateTime, 
					response[0].stalls.deliveryStall, 
					response[1].vehicle,
					userService.decodeToken(req.headers.authorization.split(' ')[1])['id'], 
					req.body.booking.total,
					driver
				)
			).then(value => {
				
				res.status(200).send();

			});
			
		});
		
    }

	public async checkAvailability(req: Request, res: Response, next: any){

		//Argomenti body: pickUpDateTime, deliveryDateTime, driver, seriale

        Promise.resolve(bookingService.checkAvailability(req.query)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.error, value.httpError.message));

			if(!value.availability)
			{
				res.status(200).send({
					"available": value.availability
				});
				
				return;
			}

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