import { getRepository, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

import { Driver } from "../entity/Driver";
import { Payment } from "../entity/Payment";
import { Stall } from "../entity/Stall";

import { Booking } from '../entity/Booking';
import { Vehicle } from '../entity/Vehicle';
import CryptoJS from 'crypto-js';

export async function checkAvailability(bookingPayload:any): Promise<any> {

    try {

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

		return {httpError: undefined, booking: booking};

	} catch (error) {
		
		return {httpError: {code:500, message:"Errore interno al server"}, booking: undefined};
	}
}

export async function getBookingBy(bookingID: number): Promise<any>{

	try {
		const booking = await getRepository(Booking).findOne({
			relations: ["status", "user", "vehicle", "deliveryStall"],
			where: { id: bookingID}
		});

		if(booking != undefined)
			return { httpError: undefined, booking: booking}
		else
			return { httpError: {code: 404, message: "Booking non trovato"}, booking: undefined};

	}
	catch (err) {
		return {httpError: {code: 500, message:"Errore interno al server"}, booking: undefined};
	}
}

export async function getActiveBookings(): Promise<any> {

	try {

		var oneYearFromNow = new Date();
		oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

		var activeBookings = await getRepository(Booking).find({
			select: ["id", "pickUpDateTime", "deliveryDateTime", "status", "vehicle"],
			relations: ["status", "vehicle", "status.staffPickup", "status.staffDelivery"],
			where: {
				pickUpDateTime: LessThanOrEqual(oneYearFromNow)
			}
		});

		activeBookings = activeBookings.filter(activeBooking => { return activeBooking.status == null || activeBooking.status.staffDelivery == undefined });

		return {httpError: undefined, activeBookings: activeBookings};

	} catch (error) {
		console.log(error);
		return {httpError: {code: 500, message:"Errore interno al server"}, activeBookings: undefined};
		
	}

	

}
