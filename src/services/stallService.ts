import { getRepository } from "typeorm";
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
		return { code:500, message:"Errore interno al server" };
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

        return undefined;

    } catch(err)
    {
        if(err.code == "ER_DUP_ENTRY")
            return {code:400, message:"Stallo già esistente"};
        else
            return {code:500, message:"Errore interno al server"};
    }

}

function verifyRoleFromToken(token: any) : object{

    let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    let decodedToken = jwt.verify(token, publicKEY);

    if(decodedToken["role"] != 2)
        return {code: 401, message: "Non hai i permessi per effettuare questa richiesta"};

    return undefined;
}