import { getRepository } from "typeorm";
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { jwtSettings } from '../jwtsettings';

import { Mailer } from '../mailer';

export async function authUser(email:string, password:string): Promise<any> {

    const user = await getRepository(User).findOne({
    	select: ["id", "email", "password"],
		where: { email: email },
	})

    if(user == null || !bcrypt.compareSync(password, user.password))
        return {httpError: {code:400, message:"Email o password errati"}, token: undefined};

    if(user.active == 0)
        return {httpError: {code:401, message:"Utente non attivato. Controlla la mail"}, token: undefined};

    var privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');

    var token = jwt.sign({
        "id": user.id,
        'role': 0
    }, privateKEY, jwtSettings);

    return {httpError: undefined, token: token};
}

export async function createUser(userPayload:any, hasDrivingLicense:boolean): Promise<any> {

    let user = new User();

    //INSERIMENTO DATI PRINCIPALI
    user.name = converToCapitalizedCase(userPayload.name);
    user.surname = converToCapitalizedCase(userPayload.surname);
    user.fiscalCode = userPayload.fiscalCode;
    user.birthDate = userPayload.birthDate;
    user.birthPlace = converToCapitalizedCase(userPayload.birthPlace);
    user.email = userPayload.email;
    user.password = bcrypt.hashSync(userPayload.password, 8);
    user.active = 0;
    user.pin = userPayload.pin;

    if(hasDrivingLicense)
        user.drivingLicense = userPayload.drivingLicense;

    try {

        await getRepository(User).save(user);
        sendActivationLink(user.email);

        return undefined;

    } catch(err)
    {
        if(err.code == "ER_DUP_ENTRY")
            return {code:400, message:"Utente già esistente"};
        else
            return {code:500, message:"Errore interno al server"};
    }
}

async function sendActivationLink(userEmail:string) {

    Mailer.sendActivationMail(userEmail);

}

export async function sendBookingInfos(userEmail:string, bookingPayload:any) {

	var pickUpDate = bookingPayload.pickUpDateTime.split('T')[0];
	var pickUpTime = bookingPayload.pickUpDateTime.split('T')[1].slice(0,5);
	var deliveryDate = bookingPayload.deliveryDateTime.split('T')[0];
	var deliveryTime = bookingPayload.deliveryDateTime.split('T')[1].slice(0,5);

	var mailBody = "Grazie per aver scelto i nostri servizi.\n\n"

	if(bookingPayload.driver == undefined)
	{
		
		mailBody += "Potrai prelevare il tuo mezzo [" + bookingPayload.vehicle.brand + " " + bookingPayload.vehicle.model + 
		"] giorno " + pickUpDate + " alle ore " + pickUpTime + " in " + bookingPayload.pickUpStall.address + ".\n\n";

		if(pickUpDate == deliveryDate)
			mailBody += "Ricordati di riconsegnarla entro le ore " + deliveryTime + ", in " + bookingPayload.deliveryStall.address + ".\n";
		else 
			mailBody += "Ricordati di riconsegnarla entro giorno " + deliveryDate + " alle ore " + deliveryTime +
			", in " + bookingPayload.deliveryStall.address + ".\n";
	}
	else 
	{
		mailBody += "Potrai incontrare " + bookingPayload.driver.name + ", l'autista del tuo mezzo [" + bookingPayload.vehicle.brand + " " + bookingPayload.vehicle.model + 
		"], giorno " + pickUpDate + " alle ore " + pickUpTime + " in " + bookingPayload.pickUpStall.address + ".\n\n";

		mailBody += "La corsa terminerà alle ore ore " + deliveryTime + ", in " + bookingPayload.deliveryStall.address + ".\n";
	}

    Mailer.sendBookingMail(userEmail, mailBody);

}

export async function activateUser(userEmail:string): Promise<any> {

    const user = await getRepository(User).findOne({where:{'email': userEmail}})
    if(user != null)
    {
        try {
            user.active = 1;
            await getRepository(User).save(user);

            return undefined;

        } catch (error) {
            return {code:500, message:"Errore interno al server"};
        }
    }
    else
        return {code:400, message:"Utente non esistente"};
}

export async function changePin(userId:number, newPin:string): Promise<any> {

    try {

        const user = await getRepository(User).findOne(userId);
        user.pin = newPin;
        await getRepository(User).save(user);

        return undefined;

    } catch (error) {
        return {code:500, message:"Errore interno al server"};
    }
}

export async function getProfile(userId:number): Promise<any> {

    try {

        const user = await getRepository(User).findOne({
			relations: ['drivingLicense'],
			where: { 'id': userId }
		});

        return {httpError:undefined, profile:user};

    } catch (error) {
		console.log(error);
        return {httpError: {code:500, message:"Errore interno al server"}, profile:undefined};
    }
}

export function decodeToken(userToken:any) {

	var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
	return jwt.verify(userToken, publicKEY);
}

export async function hasDrivingLicense(userId:number): Promise<boolean>{

	const user = await getRepository(User).findOne({
		relations: ['drivingLicense'],
		where: { 'id': userId }
	});

	return user.drivingLicense != undefined;

}

function converToCapitalizedCase(words: string): string {
	
	const wordsArray = words.toLowerCase().split(" ");

    for (var i = 0; i < wordsArray.length; i++)
        wordsArray[i] = wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1);

    return wordsArray.join(" ");
}