import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { jwtSettings } from '../jwtsettings';
import { Mailer } from '../mailer';
import createHttpError from 'http-errors';
import CryptoJS from 'crypto-js';

import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import { Vehicle } from '../entity/Vehicle';

export class VehicleController
{
    public async index(req: Request, res: Response, next:any)
    {
        const vehicles = await getRepository(Vehicle).createQueryBuilder("Vehicle")
        .select(['brand', 'model'])
        .distinct(true)
        .getRawMany();

        res.status(200).send(vehicles);
    }

    public async ddddd(req: Request, res: Response, next:any)
    {
        const vehicles = await getRepository(Vehicle).find({where: {brand: req.params.brand, model: req.params.model }});


        console.log(await vehicles[0].gasCar)
        console.log("///////////////////")
        console.log(vehicles);
    }

}
