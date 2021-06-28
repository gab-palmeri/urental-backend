import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import createHttpError from 'http-errors';

import { Vehicle } from '../entity/Vehicle';
import { GasCar } from '../entity/GasCar';
import { ElectricCar } from '../entity/ElectricCar';
import { GasMotorbike } from '../entity/GasMotorbike';
import { ElectricMotorbike } from '../entity/ElectricMotorbike';
import { Bike } from '../entity/Bike';
import { Scooter } from '../entity/Scooter';

export class VehicleController
{
    public async getPreview(req: Request, res: Response, next:any)
    {
        try {
            //CONSIDERARE IL NASCONDERE GLI ID
            var cars = await getRepository(GasCar).createQueryBuilder("GasCar")
                .leftJoinAndSelect("GasCar.vehicle", "vehicle")
                .orderBy("RAND()")
                .limit(4)
                .getMany();

            var motorbikes = await getRepository(GasMotorbike).createQueryBuilder("GasMotorbike")
                .leftJoinAndSelect("GasMotorbike.vehicle", "vehicle")
                .orderBy("RAND()")
                .limit(3)
                .getMany();

            res.status(200).send([cars,motorbikes]);

        } catch(err)
        {
            console.log(err);
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    public async getCars(req: Request, res: Response, next:any)
    {
        //DISTINCT IN BASE AL MODELLO E AL BRAND
        try {
            const gasCars = await getRepository(GasCar).find({relations : ['vehicle']});
            const electricCars = await getRepository(ElectricCar).find({relations : ['vehicle']});

            res.status(200).send([...gasCars, ...electricCars]);

        } catch (err) {
            return next(createHttpError(500, "Errore interno al server."));
        }

        // var fullUrl = req.protocol + '://' + req.get('host');
        // console.log(fullUrl);
    }

    public async getMotorbikes(req: Request, res: Response, next:any)
    {
        //DISTINCT IN BASE AL MODELLO E AL BRAND
        try {
            const gasMotorbikes = await getRepository(GasMotorbike).find({relations : ['vehicle']});
            const electricMotorbikes = await getRepository(ElectricMotorbike).find({relations : ['vehicle']});

            res.status(200).send([...gasMotorbikes, ...electricMotorbikes]);

        } catch (error) {
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    public async getBikes(req: Request, res: Response, next:any)
    {
        try {
            var bikes = await getRepository(Bike).find({relations: ['vehicle']});
            res.status(200).send(bikes);

        } catch (error) {
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    public async getScooters(req: Request, res: Response, next:any)
    {
        try {
            var scooters = await getRepository(Scooter).find({relations: ['vehicle']});

            res.status(200).send(scooters);

        } catch (error) {
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

}
