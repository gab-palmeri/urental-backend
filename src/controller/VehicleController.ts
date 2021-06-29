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

            const vehicles = await getRepository(Vehicle).createQueryBuilder("vehicle")
                .select(['brand', 'model','type', 'imgUrl'])
                .groupBy("vehicle.brand")
                .addGroupBy("vehicle.model")
                .getRawMany();

            const cars = vehicles.filter(vehicle => vehicle.type >= 0 && vehicle.type <= 1);
            const motorbikes = vehicles.filter(vehicle => vehicle.type >= 2 && vehicle.type <= 3);

            //We will have one brand/model for bikes and one brand/model for scooters
            const bike = vehicles.filter(vehicle => vehicle.type == 4);
            const scooter = vehicles.filter(vehicle => vehicle.type == 5);

            res.status(200).send([cars,motorbikes,bike,scooter]);

        } catch(err)
        {
            console.log(err);
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    public async getCars(req: Request, res: Response, next:any)
    {
        try {

            const cars = await getRepository(Vehicle).createQueryBuilder("vehicle")
                .select(['brand', 'model', 'imgUrl'])
                .where("vehicle.type >= 0")
                .andWhere("vehicle.type <= 1")
                .groupBy("vehicle.brand")
                .addGroupBy("vehicle.model")
                .getRawMany();

            res.status(200).send(cars);

        } catch (err) {
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    public async getMotorbikes(req: Request, res: Response, next:any)
    {
        try {
            const motorbikes = await getRepository(Vehicle).createQueryBuilder("vehicle")
                .select(['brand', 'model', 'imgUrl'])
                .where("vehicle.type >= 2")
                .andWhere("vehicle.type <= 3")
                .groupBy("vehicle.brand")
                .addGroupBy("vehicle.model")
                .getRawMany();

            const gasMotorbikes = await getRepository(GasMotorbike).find({relations : ['vehicle']});
            const electricMotorbikes = await getRepository(ElectricMotorbike).find({relations : ['vehicle']});

            res.status(200).send([...gasMotorbikes, ...electricMotorbikes]);

        } catch (error) {
            return next(createHttpError(500, "Errore interno al server."));
        }
    }

    //ABBIAMO UN SOLO MODELLO, SERVE CHE BIKE E SCOOTER SIANO LEGATI A VEICOLO? DA SISTEMARE
    // public async getBikes(req: Request, res: Response, next:any)
    // {
    //     try {
    //         var bikes = await getRepository(Bike).find({relations: ['vehicle']});
    //         res.status(200).send(bikes);
    //
    //     } catch (error) {
    //         return next(createHttpError(500, "Errore interno al server."));
    //     }
    // }
    //
    // public async getScooters(req: Request, res: Response, next:any)
    // {
    //     try {
    //         var scooters = await getRepository(Scooter).find({relations: ['vehicle']});
    //
    //         res.status(200).send(scooters);
    //
    //     } catch (error) {
    //         return next(createHttpError(500, "Errore interno al server."));
    //     }
    // }

    //METODI PER I SINGOLI BRAND
    public async getVehicleOptions(req: Request, res: Response, next:any)
    {
        var vehicles = await getRepository(Vehicle).find({ where: { brand: req.params.brand, model: req.params.model } });

        var results: Vehicle[] = await Promise.all(vehicles.map(async (vehicle) => {
            switch (vehicle.type) {
                case 0:
                    await vehicle.gasCar;
                    break;
                case 1:
                    await vehicle.electricCar;
                    break;
                case 2:
                    await vehicle.gasMotorbike;
                    break;
                case 3:
                    await vehicle.electricMotorbike;
                    break;
                case 4:
                    await vehicle.bike;
                    break;
                case 5:
                    await vehicle.scooter;
                    break;
                default:
                    break;
            }
            return vehicle;
        }));

        res.status(200).send(results);

    }

}
