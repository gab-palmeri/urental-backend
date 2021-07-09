import {getRepository} from "typeorm";

import { Status } from "../entity/Status";
import { Booking } from "../entity/Booking";

export async function editOrCreate(booking: Booking, statusPayload: any){

    try{

        let status;

        if(booking.status != undefined)
            status = booking.status;
        else
            status = new Status();

        Object.keys(statusPayload).forEach( key => {
            status[key] = statusPayload[key]
        });

        booking.status = status;

        await getRepository(Booking).save(booking);

    } catch (error) {
        console.log(error);
        return {code: 500, message: "Errore interno al server"};
    }

}