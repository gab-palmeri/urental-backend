import { Driver } from "../entity/Driver";
import { Payment } from "../entity/Payment";
import { Stall } from "../entity/Stall";
import { getRepository } from "typeorm";

import { Booking } from '../entity/Booking';
import { Vehicle } from '../entity/Vehicle';
import CryptoJS from 'crypto-js';
export async function checkAvailability(bookingPayload:any): Promise<any> {

    try {
		
		var vehicle = await getRepository(Vehicle).findOne({
			relations: ['bookings'],
			where: { serialNumber: bookingPayload.serialNumber }
		});

		var available = vehicle.bookings.every(booking => {
			
			var fc1 = new Date(bookingPayload.pickUpDateTime) < booking.pickUpDateTime;
			var fc2 = new Date(bookingPayload.deliveryDateTime) < booking.pickUpDateTime;

			var sc1 = new Date(bookingPayload.pickUpDateTime) > booking.deliveryDateTime;
			var sc2 = new Date(bookingPayload.deliveryDateTime) > booking.deliveryDateTime; 

			return (fc1 && fc2) || (sc1 && sc2);
		});

		return {availability: available};

    } catch(err)
    {
        console.log(err);
        return {code:500, message:"Errore interno al server"};
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
