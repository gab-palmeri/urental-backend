import { getRepository } from "typeorm";

import { Stall } from '../entity/Stall';

export async function getStalls(): Promise<any> {

	try 
	{
		const stalls = await getRepository(Stall).find();
		return stalls;

	} catch (error)
	{
		return { code:500, message:"Errore interno al server" };
	}
}

export async function createStall(stallPayload:any): Promise<any> {

	let stall = new Stall();

    //INSERIMENTO DATI PRINCIPALI
    stall.name = stallPayload.name;
    stall.address = stallPayload.address;
    stall.city = stallPayload.city;
	stall.latitude = stallPayload.latitude;
	stall.longitude = stallPayload.longitude;

    try {

        await getRepository(Stall).save(stall);

        return undefined;

    } catch(err)
    {
        if(err.code == "ER_DUP_ENTRY")
            return {code:400, message:"Stallo già esistente"};
        else
            return {code:500, message:"Errore interno al server"};
    }

}