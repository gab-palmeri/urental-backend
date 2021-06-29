import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { jwtSettings } from '../jwtsettings';
import { Mailer } from '../mailer';
import createHttpError from 'http-errors';
import CryptoJS from 'crypto-js';

import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import { User } from '../entity/User';
import { DrivingLicense } from '../entity/DrivingLicense';
import { userSchema } from "./schemas/UserSchema";
import { drivingLicenseSchema } from "./schemas/DrivingLicenseSchema";

export class UserController
{
    public async auth(req: Request, res: Response, next:any)
    {
        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        const user = await getRepository(User).findOne({where:{'email': req.body.email}})
        if(user.active == 1)
            if(user != null && bcrypt.compareSync(req.body.password, user.password))
            {
                var privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');

                var token = jwt.sign({
                    "id": user.id,
                    'name': user.name,
                    'surname': user.surname,
                    'role': 0
                }, privateKEY, jwtSettings);

                res.status(200).send({
                    'token': token,
                });
            }
            else
                return next(createHttpError(400, "Email o password invalidi"));
        else
            return next(createHttpError(401, "Utente non attivato. Controlla la mail"));
    }

    //Creo un nuovo oggetto User solo dopo averne validato i campi, dopo faccio lo stesso con DrivingLicense
    public async create(req: Request, res: Response, next:any)
    {
        var { error, value } = userSchema.validate(req.body, {allowUnknown:true});
        if(error == undefined)
        {
            let user = new User();

            //INSERIMENTO DATI PRINCIPALI
            user.name = req.body.name;
            user.surname = req.body.surname;
            user.fiscalCode = req.body.fiscalCode;
            user.birthDate = req.body.birthDate;
            user.birthPlace = req.body.birthPlace;
            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, 8);
            user.active = 0;
            user.pin = req.body.pin;

            //INSERIMENTO DATI PATENTE
            if(req.body.drivingLicense != undefined)
            {
                ({ error, value } = drivingLicenseSchema.validate(req.body.drivingLicense, {allowUnknown:true}));

                if(error == undefined)
                    user.drivingLicenses = [req.body.drivingLicense];
                 else
                    return next(createHttpError(400, error.details[0].message));
            }

            try {

                await getRepository(User).save(user);
                Mailer.sendEmail(user.email);
                res.status(200).send()

            } catch(err)
            {
                if(err.code == "ER_DUP_ENTRY")
                    return next(createHttpError(400, "Utente già esistente."));
                else
                    return next(createHttpError(500, "Errore interno al server."));
            }
        }
        else
            return next(createHttpError(400, error.details[0].message));
    }

    public async activate(req: Request, res: Response, next:any)
    {
        var symmetricKey  = fs.readFileSync('./keys/symmetric.key', 'utf8');
        var token = req.query.token.toString().replace('xMl3Jk', '+' ).replace('Por21Ld', '/').replace('Ml32', '=');
        var userEmail = CryptoJS.AES.decrypt(token, symmetricKey).toString(CryptoJS.enc.Utf8);

        const user = await getRepository(User).findOne({where:{'email': userEmail}})
        if(user != null)
        {
            try {
                user.active = 1;
                await getRepository(User).save(user);
                res.status(200).send();
            } catch (error) {
                return next(createHttpError(500, "Errore interno al server."));
            }
        }
        else
            return next(createHttpError(400, "Utente non esistente"));
    }

    public async changePin(req: Request, res: Response, next:any)
    {
        if(req.body.newPin == undefined || req.body.newPin.length != 4)
            return next(createHttpError(400, "Nuovo PIN assente o malformato."));

        const token = req.headers.authorization.split(' ')[1];
        var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
        var decoded = jwt.verify(token, publicKEY);

        const user = await getRepository(User).findOne(decoded['id']);
        user.pin = req.body.newPin;

        await getRepository(User).save(user);
        res.status(200).send();
    }

}
