import { Request, Response } from 'express';
import { getRepository, In } from "typeorm";
<<<<<<< HEAD
=======
import { jwtSettings } from '../jwtsettings';
import { Mailer } from '../mailer';
>>>>>>> 8547ae351ab91ce3999841cb10b50badbb95336c
import createHttpError from 'http-errors';

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
<<<<<<< HEAD

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

=======

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

>>>>>>> 8547ae351ab91ce3999841cb10b50badbb95336c
        } catch(err)
        {
            return next(createHttpError(500, "Errore interno al server."));
        }
<<<<<<< HEAD
    }

    public async getCars(req: Request, res: Response, next:any)
    {
        try {
            const gasCars = await getRepository(Vehicle).createQueryBuilder("Vehicle")
                .innerJoinAndSelect("Vehicle.gasCar", "gascar")
                .getMany();

            const electricCars = await getRepository(Vehicle).createQueryBuilder("Vehicle")
                .innerJoinAndSelect("Vehicle.electricCar", "electriccar")
                .getMany();

            res.status(200).send([...gasCars, ...electricCars]);

        } catch (err) {
            return next(createHttpError(500, "Errore interno al server."));
        }

    }

    public async getMotorbikes(req: Request, res: Response, next:any)
    {
        try {
            const gasMotorbikes = await getRepository(Vehicle).createQueryBuilder("Vehicle")
                .innerJoinAndSelect("Vehicle.gasMotorbike", "gasmotorbike")
                .getMany();

            const electricMotorbikes = await getRepository(Vehicle).createQueryBuilder("Vehicle")
                .innerJoinAndSelect("Vehicle.electricMotorbike", "electricmotorbike")
                .getMany();

            res.status(200).send([...gasMotorbikes, ...electricMotorbikes]);

        } catch (error) {
            return next(createHttpError(500, "Errore interno al server."));
        }

=======
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
>>>>>>> 8547ae351ab91ce3999841cb10b50badbb95336c
    }

}
