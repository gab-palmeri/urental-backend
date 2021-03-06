import { getRepository } from "typeorm";
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { jwtSettings } from '../jwtsettings';

import { Mailer } from '../mailer';

import { getTokenUser } from "./tokenService";
import createHttpError from "http-errors";

export async function authUser(email:string, password:string): Promise<any> {

    const user = await getRepository(User).findOne({
    	select: ["id", "email", "password", "active"],
		where: { email: email },
	})

    if(user == null || !bcrypt.compareSync(password, user.password))
        return {httpError: {code:400, message:"Email o password errati"}, token: undefined};

    if(user.active == 0)
        return {httpError: {code:401, message:"Utente non attivato. Controlla la mail"}, token: undefined};

    return getTokenUser(user.id);
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

        return {httpError: undefined};

    } catch(err)
    {
        if(err.code == "ER_DUP_ENTRY")
            return {httpError: {code:400, message:"Utente già esistente"}};
        else
            return {httpError: {code:500, message:"Errore interno al server"}};
    }
}

async function sendActivationLink(userEmail:string) {

    Mailer.sendActivationMail(userEmail);

}

export async function sendBookingInfos(userEmail:string, bookingPayload:any) {

	var convertedPickUpDateTime = new Date(bookingPayload.pickUpDateTime);
	var convertedDeliveryDateTime = new Date(bookingPayload.deliveryDateTime);

	var pickUpDate = convertedPickUpDateTime.toLocaleDateString("it-IT", {timeZone: 'Europe/Rome'});
	var pickUpTime = convertedPickUpDateTime.toLocaleTimeString("it-IT", {timeZone: 'Europe/Rome'})
	var deliveryDate = convertedDeliveryDateTime.toLocaleDateString("it-IT", {timeZone: 'Europe/Rome'});
	var deliveryTime = convertedDeliveryDateTime.toLocaleTimeString("it-IT", {timeZone: 'Europe/Rome'});

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

    Mailer.sendMail(userEmail, 'Il tuo noleggio su urental', mailBody);

}

export async function sendLateMail(booking:any) {

	var mailObject = "Attenzione - Sei in ritardo con la consegna!"

	var convertedPickUpDateTime = new Date(booking.pickUpDateTime);
	var convertedDeliveryDateTime = new Date(booking.deliveryDateTime);

	var pickUpDate = convertedPickUpDateTime.toLocaleDateString("it-IT", {timeZone: 'Europe/Rome'});
	var pickUpTime = convertedPickUpDateTime.toLocaleTimeString("it-IT", {timeZone: 'Europe/Rome'})
	var deliveryDate = convertedDeliveryDateTime.toLocaleDateString("it-IT", {timeZone: 'Europe/Rome'});
	var deliveryTime = convertedDeliveryDateTime.toLocaleTimeString("it-IT", {timeZone: 'Europe/Rome'});

	var mailBody = "La tua consegna del mezzo [" + booking.vehicle.brand + " " + booking.vehicle.model + "] è in ritardo.\n\n"
	mailBody += "Portala al più presto allo stallo di consegna in " + booking.deliveryStall.address + ".\n\n"
	mailBody += `Per non incorrere in un sovrapprezzo, comunicaci la ragione del tuo ritardo rispondendo a questa mail.
				Opzionalmente, puoi specificare un nuovo stallo di consegna, se ti è più comodo.`


	Mailer.sendMail(booking.user.email, mailObject, mailBody);

}

export async function activateUser(userEmail:string): Promise<any> {

	var user;

	try {
		user = await getRepository(User).findOne({where:{'email': userEmail}});
	} catch (error) {
		return {httpError: {code:500, message:"Errore interno al server"}};
	}

    if(user != null)
    {
        try {
            user.active = 1;
            await getRepository(User).save(user);

            return {httpError: undefined};

        } catch (error) {
            return {httpError: {code:500, message:"Errore interno al server"}};
        }
    }
    else
        return {httpError: {code:400, message:"Utente non esistente"}};
}

export async function changePin(userId:number, newPin:string): Promise<any> {

    try {

        const user = await getRepository(User).findOne(userId);
        user.pin = newPin;
        await getRepository(User).save(user);

        return {httpError: undefined};

    } catch (error) {
        return {httpError: {code:500, message:"Errore interno al server"}};
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

export async function hasDrivingLicense(userId:number): Promise<any>{

	
	try {
		const user = await getRepository(User).findOne({
			relations: ['drivingLicense'],
			where: { 'id': userId }
		});

		return {httpError: undefined, hasDrivingLicense: user.drivingLicense != undefined};

	} catch (error) {

		return {httpError: {code:500, message:"Errore interno al server"}, hasDrivingLicense:undefined};

	}
}

export async function getBookingsBy(userId: number): Promise<any>{

    try {
        const bookings = await getRepository(User).findOne({
            relations: ["bookings", "bookings.vehicle", "bookings.pickUpStall", "bookings.deliveryStall", "bookings.payment"],
            where: { "id": userId }
        });

        return {httpError:undefined, bookings: bookings.bookings};

    } catch (error) {
        console.log(error);
        return {httpError: {code: 500, message: "Errore interno al server"}, bookings: undefined};
    }
}

function converToCapitalizedCase(words: string): string {
	
	const wordsArray = words.toLowerCase().split(" ");

    for (var i = 0; i < wordsArray.length; i++)
        wordsArray[i] = wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1);

    return wordsArray.join(" ");
}