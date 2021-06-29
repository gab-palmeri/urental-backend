import { Request, Response } from "express";
import createHttpError from "http-errors";
import { getRepository } from "typeorm";
import { jwtSettings } from "../jwtsettings";

import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

import { Staff } from "../entity/Staff";
import { staffAndDriverSchema as StaffSchema} from "./schemas/StaffAndDriverSchema";


export class StaffController{

    public async auth(req: Request, res: Response, next: any){

        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        const staff = await getRepository(Staff).findOne({where: {"email": req.body.email}})

        if(staff == null || !bcrypt.compareSync(req.body.password, staff.password))
            return next(createHttpError(400, "Email o password invalidi"));

        let privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

        let token = jwt.sign({
            "email": staff.email,
            "name": staff.name,
            "surname": staff.surname,
            "role": 2
        }, privateKEY, jwtSettings);

        res.status(200).send({
            "token": token,
        });
    }

    public async create(req: Request, res: Response, next: any){

        const token = req.headers.authorization.split(" ")[1];
        let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
        let decodedToken = jwt.verify(token, publicKEY);

        if(decodedToken["role"] != 2)
            return next(createHttpError(401, "Non hai i permessi per effettuare questa richiesta"));

        let { error, value } = StaffSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        let staff = new Staff();

        /*
            PAYLOAD INFORMATIONS
        */

        staff.name = req.body.name;
        staff.surname = req.body.surname;
        staff.fiscalCode = req.body.fiscalCode;
        staff.birthDate = req.body.birthDate;
        staff.birthPlace = req.body.birthPlace;
        staff.email = req.body.email;
        staff.password = bcrypt.hashSync(req.body.password, 8);

        try{

            await getRepository(Staff).save(staff);
            res.status(200).send();
        }
        catch(err){

            if(err.code == "ER_DUP_ENTRY")
                return next(createHttpError(400, "Staff già esistente."));
            else
                return next(createHttpError(500, "Errore interno al server."));
        }
    }
}