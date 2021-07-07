import { Driver } from "../entity/Driver";
import { Payment } from "../entity/Payment";
import { Stall } from "../entity/Stall";
import { getRepository } from "typeorm";

import { Booking } from '../entity/Booking';
import { Vehicle } from '../entity/Vehicle';
import CryptoJS from 'crypto-js';
export async function checkAvailability(bookingPayload:any): Promise<any> {

    try {
		
		console.log(bookingPayload);

		var vehicle = await getRepository(Vehicle).findOne({
			relations: ['bookings'],
			where: { serialNumber: bookingPayload.serialNumber }
		});

		if(vehicle == undefined)
			return {httpError: {code:404, message:"Veicolo non trovato"}, availability:undefined };

		var available = vehicle.bookings.every(booking => {
			
			var fc1 = new Date(bookingPayload.pickUpDateTime) < booking.pickUpDateTime;
			var fc2 = new Date(bookingPayload.deliveryDateTime) < booking.pickUpDateTime;

			var sc1 = new Date(bookingPayload.pickUpDateTime) > booking.deliveryDateTime;
			var sc2 = new Date(bookingPayload.deliveryDateTime) > booking.deliveryDateTime; 

			return (fc1 && fc2) || (sc1 && sc2);
		});

		return {httpError: undefined, availability: available};

    } catch(err)
    {
        console.log(err);
        return {httpError: {code:500, message:"Errore interno al server"}, availability:undefined };
    }
}

export async function createBooking(pickUpDateTime:Date, pickUpStall:Stall, deliveryDateTime:Date, deliveryStall:Stall, vehicle:Vehicle, userId:any, total:number, driver: Driver): Promise<any> {

	try {
		var booking = new Booking();

		booking.pickUpDateTime = pickUpDateTime;
		booking.pickUpStall = pickUpStall;

		booking.deliveryDateTime = deliveryDateTime;
		booking.deliveryStall = deliveryStall;
		
		booking.vehicle = vehicle;

		booking.user = userId;
		booking.driver = driver;

		var payment = new Payment();
		payment.total = total
		payment.paymentCode = CryptoJS.lib.WordArray.random(5).toString();

		booking.payment = payment;

		await getRepository(Booking).save(booking);

	} catch (error) {
		
		console.log(error);
	}
}
