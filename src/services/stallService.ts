import { getRepository, In } from "typeorm";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";

import { Stall } from '../entity/Stall';

export async function getStalls(): Promise<any> {

	try 
	{
		const stalls = await getRepository(Stall).find();
		return stalls;

	} catch (error)
	{
		return {httpError: {code:500, message:"Errore interno al server" }};
	}
}

export async function createStall(stallPayload:any): Promise<any> {

	const token = stallPayload.headers.authorization.split(" ")[1];
    let httpError = verifyRoleFromToken(token);

    if(httpError != undefined)
        return httpError;

	let stall = new Stall();

    //INSERIMENTO DATI PRINCIPALI
    stall.name = stallPayload.body.name;
    stall.address = stallPayload.body.address;
    stall.city = stallPayload.body.city;

    try {

        await getRepository(Stall).save(stall);

        return {httpError: undefined};

    } catch(err)
    {
        if(err.code == "ER_DUP_ENTRY")
            return {httpError: {code:400, message:"Stallo già esistente"}};
        else
            return {httpError: {code:500, message:"Errore interno al server"}};
    }

}

export async function getBookingStalls(pickUpStall:number, deliveryStall:number): Promise<any> {

	try {
		
		const stalls = await getRepository(Stall).find({
			where: { id: In([pickUpStall, deliveryStall])}
		});
		
		if(pickUpStall == deliveryStall || stalls.length == 2)
			return { 
				httpError: undefined, 
				stalls: {
					pickUpStall: stalls.find(stall => stall.id == pickUpStall), 
					deliveryStall: stalls.find(stall => stall.id == deliveryStall)
				}
			}
		else 
			return {
				httpError: {code:404, message:"Stalli non trovati"},
				stalls: undefined
			}

	} catch (err) {
		console.log(err);
		return {httpError: {code:500, message:"Errore interno al server"}, stalls: undefined};

	}
}


function verifyRoleFromToken(token: any) : object{

    let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    let decodedToken = jwt.verify(token, publicKEY);

    if(decodedToken["role"] != 2)
        return {code: 401, message: "Non hai i permessi per effettuare questa richiesta"};

    return undefined;
}