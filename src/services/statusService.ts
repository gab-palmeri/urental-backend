import {getRepository} from "typeorm";

import { Status } from "../entity/Status";
import { Booking } from "../entity/Booking";

export async function editOrCreate(booking: Booking, statusPayload: any) : Promise<any>{

    try{

        let status;

        if(booking.status != undefined)
            status = booking.status;
        else{
            status = new Status();
            status.booking = booking.id
        }

        Object.keys(statusPayload).forEach( key => {
            status[key] = statusPayload[key]
        });

        booking.status = status;

        await getRepository(Booking).save(booking);

		return {httpError: undefined}

    } catch (error) {
        console.log(error);
        return {httpError: {code: 500, message: "Errore interno al server"}};
    }
}