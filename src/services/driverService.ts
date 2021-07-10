import {getRepository} from "typeorm";
import {jwtSettings} from "../jwtsettings";

import * as bcrypt from "bcryptjs";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";

import {Driver} from "../entity/Driver";

export async function authDriver(email: string, password: string) : Promise<any>{

    const driver = await getRepository(Driver).findOne({where: {"email": email}})

    if(driver == null || !bcrypt.compareSync(password, driver.password))
        return {httpError: {code: 400, message: "Email o password invalidi"}, token: undefined};

    let privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

    let token = jwt.sign({
        "id": driver.id,
        "role": 1
    }, privateKEY, jwtSettings);

    return {httpError: undefined, token: token};
}

export async function createDriver(driverPayload: any) : Promise<any>{

    const token = driverPayload.headers.authorization.split(" ")[1];
    let httpError = verifyRoleFromToken(token);

    if(httpError != undefined)
        return httpError;

    let driver = new Driver();

    driver.name = converToCapitalizedCase(driverPayload.body.name);
    driver.surname = converToCapitalizedCase(driverPayload.body.surname);
    driver.fiscalCode = driverPayload.body.fiscalCode;
    driver.birthDate = driverPayload.body.birthDate;
    driver.birthPlace = converToCapitalizedCase(driverPayload.body.birthPlace);
    driver.email = driverPayload.body.email;
    driver.password = bcrypt.hashSync(driverPayload.body.password, 8);

    try{
        await getRepository(Driver).save(driver);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {httpError: {code: 400, message: "Driver già esistente."}};
        else
            return {httpError: {code: 500, message: "Errore interno al server"}};
    }

    return undefined;
}

function verifyRoleFromToken(token: any) : object{

    let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    let decodedToken = jwt.verify(token, publicKEY);

    if(decodedToken["role"] != 2)
        return {code: 401, message: "Non hai i permessi per effettuare questa richiesta"};

    return undefined;
}

export async function checkAvailability(bookingPayload:any): Promise<any> {

	try {

		const drivers = await getRepository(Driver).find({relations:['bookings']});

		var available = drivers.some(driver => {

			return driver.bookings.every(booking => {
				var fc1 = new Date(bookingPayload.pickUpDateTime) < booking.pickUpDateTime;
				var fc2 = new Date(bookingPayload.deliveryDateTime) < booking.pickUpDateTime;
				var sc1 = new Date(bookingPayload.pickUpDateTime) > booking.deliveryDateTime;
				var sc2 = new Date(bookingPayload.deliveryDateTime) > booking.deliveryDateTime; 

				return (fc1 && fc2) || (sc1 && sc2);
			});
		});

		return {httpError: undefined, availability: available};

    } catch(err)
    {
        console.log(err);
        return {httpError: {code:500, message:"Errore interno al server"}, availability:undefined};
    }
}

export async function getAvailableDriver(pickUpDateTime: string, deliveryDateTime: string): Promise<any> {

	try {

		const drivers = await getRepository(Driver).find({relations:['bookings']});

		const availableDriver = drivers.find(driver => {

			return driver.bookings.every(booking => {
				var fc1 = new Date(pickUpDateTime) < booking.pickUpDateTime;
				var fc2 = new Date(deliveryDateTime) < booking.pickUpDateTime;
				var sc1 = new Date(pickUpDateTime) > booking.deliveryDateTime;
				var sc2 = new Date(deliveryDateTime) > booking.deliveryDateTime; 

				return (fc1 && fc2) || (sc1 && sc2);
			});

		});

		if(availableDriver != undefined)
			return {httpError: undefined, driver:availableDriver};
		else
			 return {httpError: {code:404, message:"Autista disponibile non trovato"}, driver:undefined};

    } catch(err)
    {
        console.log(err);
         return {httpError: {code:500, message:"Errore interno al server"}, driver:undefined};
    }

}

function converToCapitalizedCase(words: string): string {
	
	const wordsArray = words.toLowerCase().split(" ");

    for (var i = 0; i < wordsArray.length; i++)
        wordsArray[i] = wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1);

    return wordsArray.join(" ");
}