import { getRepository } from "typeorm";

import { Booking } from '../entity/Booking';
import { Vehicle } from '../entity/Vehicle';

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
