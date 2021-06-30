import {getRepository} from "typeorm";
import {jwtSettings} from "../jwtsettings";

import * as bcrypt from "bcryptjs";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";

import {Staff} from "../entity/Staff";

export async function authStaff(email: string, password: string) : Promise<any>{

    const staff = await getRepository(Staff).findOne({where: {"email": email}})

    if(staff == null || !bcrypt.compareSync(password, staff.password))
        return {httpError: {code: 400, message: "Email o password invalidi"}, token: undefined};

    let privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

    let token = jwt.sign({
        "id": staff.id,
        "role": 2
    }, privateKEY, jwtSettings);

    return {httpError: undefined, token: token};
}

export async function createStaff(staffPayload: any) : Promise<any>{

    const token = staffPayload.headers.authorization.split(" ")[1];
    let httpError = verifyRoleFromToken(token);

    if(httpError != undefined)
        return httpError;

    let staff = new Staff();

    staff.name = staffPayload.body.name;
    staff.surname = staffPayload.body.surname;
    staff.fiscalCode = staffPayload.body.fiscalCode;
    staff.birthDate = staffPayload.body.birthDate;
    staff.birthPlace = staffPayload.body.birthPlace;
    staff.email = staffPayload.body.email;
    staff.password = bcrypt.hashSync(staffPayload.body.password, 8);

    try{
        await getRepository(Staff).save(staff);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {code: 400, message: "Staff già esistente."};
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
