import { Request, Response } from "express";
import createHttpError from "http-errors";
import { getRepository } from "typeorm";
import { jwtSettings } from "../jwtsettings";

import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

import { Driver } from "../entity/Driver";
import { otherUsersSchema } from "./schemas/OtherUsersSchema";


export class DriverController{

    public async auth(req: Request, res: Response, next: any){

        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        const driver = await getRepository(Driver).findOne({where: {"email": req.body.email}})

        if(driver == null || !bcrypt.compareSync(req.body.password, driver.password))
            return next(createHttpError(400, "Email o password invalidi"));

        let privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

        let token = jwt.sign({
            "email": driver.email,
            "name": driver.name,
            "surname": driver.surname,
            "role": 1
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

        let { error, value } = otherUsersSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        let driver = new Driver();

        /*
            PAYLOAD INFORMATIONS
        */

        driver.name = req.body.name;
        driver.surname = req.body.surname;
        driver.fiscalCode = req.body.fiscalCode;
        driver.birthDate = req.body.birthDate;
        driver.birthPlace = req.body.birthPlace;
        driver.email = req.body.email;
        driver.password = bcrypt.hashSync(req.body.password, 8);

        try{

            await getRepository(Driver).save(driver);
            res.status(200).send();
        }
        catch(err){

            if(err.code == "ER_DUP_ENTRY")
                return next(createHttpError(400, "Driver già esistente."));
            else
                return next(createHttpError(500, "Errore interno al server."));
        }
    }
}