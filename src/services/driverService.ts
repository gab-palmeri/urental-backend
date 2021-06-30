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

    driver.name = driverPayload.body.name;
    driver.surname = driverPayload.body.surname;
    driver.fiscalCode = driverPayload.body.fiscalCode;
    driver.birthDate = driverPayload.body.birthDate;
    driver.birthPlace = driverPayload.body.birthPlace;
    driver.email = driverPayload.body.email;
    driver.password = bcrypt.hashSync(driverPayload.body.password, 8);

    try{
        await getRepository(Driver).save(driver);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {code: 400, message: "Driver già esistente."};
        else
            return {code: 500, message: "Errore interno al server"};
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