import { Request, Response } from 'express';
import { getRepository, In } from "typeorm";
import { jwtSettings } from '../jwtsettings';
import { Mailer } from '../mailer';
import createHttpError from 'http-errors';
import CryptoJS from 'crypto-js';

import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import { Vehicle } from '../entity/Vehicle';
import { GasCar } from '../entity/GasCar';
import { ElectricCar } from '../entity/ElectricCar';
import { GasMotorbike } from '../entity/GasMotorbike';
import { ElectricMotorbike } from '../entity/ElectricMotorbike';
import { Bike } from '../entity/Bike';

export class VehicleController
{
    public async getPreview(req: Request, res: Response, next:any)
    {
        try {
            //CONSIDERARE IL NASCONDERE GLI ID
            const cars = await getRepository(GasCar).createQueryBuilder("GasCar")
                .leftJoinAndSelect("GasCar.vehicle", "vehicle")
                .orderBy("RAND()")
                .limit(3)
                .getMany();

            const motorbikes = await getRepository(GasMotorbike).createQueryBuilder("GasMotorbike")
                .leftJoinAndSelect("GasMotorbike.vehicle", "vehicle")
                .orderBy("RAND()")
                .limit(3)
                .getMany();

            const bikes = await getRepository(Bike).createQueryBuilder("Bike")
                .leftJoinAndSelect("Bike.vehicle", "vehicle")
                .orderBy("RAND()")
                .limit(3)
                .getMany();

            res.status(200).send([cars,motorbikes,bikes]);

        } catch(err)
        {
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    public async getCars(req: Request, res: Response, next:any)
    {
        const gasCars = await getRepository(Vehicle).createQueryBuilder("Vehicle")
            .innerJoinAndSelect("Vehicle.gasCar", "gascar")
            .getMany();

        const electricCars = await getRepository(Vehicle).createQueryBuilder("Vehicle")
            .innerJoinAndSelect("Vehicle.electricCar", "electriccar")
            .getMany();

        res.status(200).send([...gasCars, ...electricCars]);
    }

    public async getMotorbikes(req: Request, res: Response, next:any)
    {
        const gasMotorbikes = await getRepository(Vehicle).createQueryBuilder("Vehicle")
            .innerJoinAndSelect("Vehicle.gasMotorbike", "gasmotorbike")
            .getMany();

        const electricMotorbikes = await getRepository(Vehicle).createQueryBuilder("Vehicle")
            .innerJoinAndSelect("Vehicle.electricMotorbike", "electricmotorbike")
            .getMany();

        res.status(200).send([...gasMotorbikes, ...electricMotorbikes]);
    }

}
