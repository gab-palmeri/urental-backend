import { getRepository } from "typeorm";
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { jwtSettings } from '../jwtsettings';

import { Mailer } from '../mailer';

export async function authUser(email:string, password:string): Promise<any> {

    const user = await getRepository(User).findOne({where:{'email': email}})

    if(user == null || !bcrypt.compareSync(password, user.password))
        return {httpError: {code:400, message:"Email o password invalidi"}, token: undefined};

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

    //MODIFICA DEL PAYLOAD METTENDO LA MAIUSCOLA PER OGNI PAROLA (NOME,COGNOME,CITTà)
    const nameArray = userPayload.name.toLowerCase().split(" ");
    const surnameArray = userPayload.surname.toLowerCase().split(" ");

    for (var i = 0; i < nameArray.length; i++)
        nameArray[i] = nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1);
    for (var i = 0; i < surnameArray.length; i++)
        surnameArray[i] = surnameArray[i].charAt(0).toUpperCase() + surnameArray[i].slice(1);

    userPayload.name = nameArray.join(" ");
    userPayload.surname = surnameArray.join(" ");
    userPayload.birthPlace = userPayload.birthPlace.charAt(0).toUpperCase() + userPayload.birthPlace.slice(1).toLowerCase()

    //INSERIMENTO DATI PRINCIPALI
    user.name = userPayload.name;
    user.surname = userPayload.surname;
    user.fiscalCode = userPayload.fiscalCode;
    user.birthDate = userPayload.birthDate;
    user.birthPlace = userPayload.birthPlace;
    user.email = userPayload.email;
    user.password = bcrypt.hashSync(userPayload.password, 8);
    user.active = 0;
    user.pin = userPayload.pin;

    if(hasDrivingLicense)
        user.drivingLicenses = [userPayload.drivingLicense];

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

    Mailer.sendEmail(userEmail);

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
