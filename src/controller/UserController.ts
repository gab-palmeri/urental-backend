import { Request, Response } from 'express';

import createHttpError from 'http-errors';
import CryptoJS from 'crypto-js';

import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import { userSchema } from "../schemas/UserSchema";
import { drivingLicenseSchema } from "../schemas/DrivingLicenseSchema";

import * as userService from '../services/userService';

export class UserController
{
    public async auth(req: Request, res: Response, next:any)
    {
        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        Promise.resolve(userService.authUser(req.body.email, req.body.password)).then(function(value) {

            if(value.httpError == undefined)
                res.status(200).send({
                    'token': value.token,
                });
            else
                return next(createHttpError(value.httpError.code, value.httpError.message));
        });
    }

    public async create(req: Request, res: Response, next:any)
    {
        var { error, value } = userSchema.validate(req.body, {allowUnknown:true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        var hasDrivingLicense = false;

        if(req.body.drivingLicense != undefined)
        {
            ({ error, value } = drivingLicenseSchema.validate(req.body.drivingLicense, {allowUnknown:true}));

            if(error != undefined)
                return next(createHttpError(400, error.details[0].message));

			req.body.drivingLicense.licenseNumber = req.body.drivingLicense.licenseNumber.toUpperCase();
			req.body.drivingLicense.releasedFrom = req.body.drivingLicense.releasedFrom.toUpperCase();
            hasDrivingLicense = true;
        }

		req.body.fiscalCode = req.body.fiscalCode.toUpperCase();

        Promise.resolve(userService.createUser(req.body, hasDrivingLicense)).then(function(value) {
            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));
            else
                res.status(200).send();
        });


    }

    public async activate(req: Request, res: Response, next:any)
    {
        if(req.body.code != undefined)
        {
            var symmetricKey  = fs.readFileSync('./keys/symmetric.key', 'utf8');
            var token = req.body.code.toString().replaceAll('xMl3Jk', '+' ).replaceAll('Por21Ld', '/').replaceAll('Ml32', '=');
            var userEmail = CryptoJS.AES.decrypt(token, symmetricKey).toString(CryptoJS.enc.Utf8);

            Promise.resolve(userService.activateUser(userEmail)).then(function(value) {
                if(value.httpError != undefined)
                    return next(createHttpError(value.httpError.code, value.httpError.message));
                else
                    res.status(200).send();
            });

        }
        else
            return next(createHttpError(400, "Token invalido"));

    }

	public async getProfile(req: Request, res: Response, next:any)
	{
		let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    	let decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], publicKEY);

		Promise.resolve(userService.getProfile(decodedToken['id'])).then(function(value) {

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));
            else
                res.status(200).send(value.profile);

        });
	}

    public async changePin(req: Request, res: Response, next:any)
    {
        if(req.body.newPin == undefined || req.body.newPin.length != 4)
            return next(createHttpError(400, "Nuovo PIN assente o malformato."));

        const token = req.headers.authorization.split(' ')[1];
        var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
        var decoded = jwt.verify(token, publicKEY);

        Promise.resolve(userService.changePin(decoded['id'], req.body.newPin)).then(function(value) {
            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));
            else
                res.status(200).send();
        });

    }

}
