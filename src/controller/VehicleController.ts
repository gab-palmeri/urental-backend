import { Request, Response } from 'express';

import createHttpError from 'http-errors';

import * as vehicleService from '../services/vehicleService';

import { Vehicle } from '../entity/Vehicle';

export class VehicleController
{

    public async getPreview(req: Request, res: Response, next:any)
    {
        Promise.resolve(vehicleService.getPreview()).then(function(value) {

            if(value.httpError == undefined)
                res.status(200).send(value.vehiclesData);
            else
                return next(createHttpError(value.httpError.code, value.httpError.message));
        });
    }

    public async getCars(req: Request, res: Response, next:any)
    {
        Promise.resolve(vehicleService.getCars()).then(function(value) {

            if(value.httpError == undefined)
                res.status(200).send(value.carsData);
            else
                return next(createHttpError(value.httpError.code, value.httpError.message));
        });
    }

    public async getMotorbikes(req: Request, res: Response, next:any)
    {
        Promise.resolve(vehicleService.getMotorbikes()).then(function(value) {

            if(value.httpError == undefined)
                res.status(200).send(value.motorbikesData);
            else
                return next(createHttpError(value.httpError.code, value.httpError.message));
        });
    }

    //METODI PER I SINGOLI BRAND
    public async getVehicleOptions(req: Request, res: Response, next:any){
        Promise.resolve(vehicleService.getVehiclesByBrandAndModel(req.params.brand, req.params.model)).then(async function(value) {

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.code, value.httpError.message));

            let vehiclesResponse = {};
            vehiclesResponse["brand"] = req.params.brand;
            vehiclesResponse["model"] = req.params.model;
            vehiclesResponse["engines"] = [];

            let vehicles : Vehicle[] = await Promise.all(value.vehiclesData.map(async (vehicle:Vehicle) => {
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

            await vehicles.forEach((vehicle) => {

                let engine = {};

                switch (vehicle.type){
                    case 0:
                        vehicle.gasCar.then(function(gasCar){

                            let engine = JSON.parse(JSON.stringify(gasCar));
                            engine["main_image"] = vehicle.main_image;
                            delete engine.id, engine.licensePlate;

                            vehiclesResponse["engines"].push(engine);
                        });
                        break;
                    case 1:
                        vehicle.electricCar.then(function(eletricCar){

                            let engine = JSON.parse(JSON.stringify(eletricCar));
                            engine["main_image"] = vehicle.main_image;
                            delete engine.id, engine.licensePlate;

                            vehiclesResponse["engines"].push(engine);
                        });
                        break;
                    case 2:
                        vehicle.gasMotorbike.then(function(gasMotorbike){

                            let engine = JSON.parse(JSON.stringify(gasMotorbike));
                            engine["main_image"] = vehicle.main_image;
                            delete engine.id, engine.licensePlate;

                            vehiclesResponse["engines"].push(engine);
                        });
                        break;
                    case 3:
                        vehicle.electricMotorbike.then(function(electricMotorbike){

                            let engine = JSON.parse(JSON.stringify(electricMotorbike));
                            engine["main_image"] = vehicle.main_image;
                            delete engine.id, engine.licensePlate;

                            vehiclesResponse["engines"].push(engine);
                        });
                        break;
                    case 4:
                        vehicle.bike.then(function(bike){

                            let engine = JSON.parse(JSON.stringify(bike));
                            engine["main_image"] = vehicle.main_image;
                            delete engine.id;

                            vehiclesResponse["engines"].push(engine);
                        });
                        break;
                    case 5:
                        vehicle.scooter.then(function(scooter){

                            let engine = JSON.parse(JSON.stringify(scooter));
                            engine["main_image"] = vehicle.main_image;
                            delete engine.id

                            vehiclesResponse["engines"].push(engine);
                        });
                        break;
                    default:
                        break;
                }
            });

            res.status(200).send(vehiclesResponse);
        });
    }

}
