import { Request, Response } from "express";
import createHttpError from "http-errors";

import {
    staffAndDriverSchema as driverSchema,
    staffAndDriverSchema as staffSchema
} from "../schemas/StaffAndDriverSchema";
import { vehicleSchema } from "../schemas/VehicleSchema"
import { gasCarSchema } from "../schemas/GasCarSchema";
import { electricCarSchema } from "../schemas/ElectricCarSchema"
import { gasMotorbikeSchema } from "../schemas/GasMotorbikeSchema";
import { electricMotorbikeSchema } from "../schemas/ElectricMotorbikeSchema";
import {
    bikeAndScooterSchema as bikeSchema,
    bikeAndScooterSchema as scooterSchema
} from "../schemas/BikeAndScooterSchema";

import * as staffService from "../services/staffService";
import * as driverService from "../services/driverService";



export class StaffController{

    public async auth(req: Request, res: Response, next: any){

        if(req.body.email == undefined || req.body.password == undefined)
            return next(createHttpError(400, "Email o password assenti"));

        Promise.resolve(staffService.authStaff(req.body.email, req.body.password)).then(function(value){

            if(value.httpError != undefined)
                return next(createHttpError(value.httpError.error, value.httpError.message));

            res.status(200).send({
                "token": value.token,
            });
        });
    }

    public async create(req: Request, res: Response, next: any){

        let { error, value } = staffSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        Promise.resolve(staffService.createStaff(req)).then(function(httpError){

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));

            res.status(200).send();
        });
    }

    public async createDriver(req: Request, res: Response, next: any){

        let { error, value } = driverSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        Promise.resolve(driverService.createDriver(req)).then(function(httpError){

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));

            res.status(200).send();
        });
    }

    public async addNewVehicle(req: Request, res: Response, next: any){

        let { error, value } = vehicleSchema.validate(req.body, {allowUnknown: true});

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        let result;
        switch (req.body.type){
            case 0:
                result  = gasCarSchema.validate(req.body, {allowUnknown: true});
                break;
            case 1:
                result = electricCarSchema.validate(req.body, {allowUnknown: true});
                break;
            case 2:
                result = gasMotorbikeSchema.validate(req.body, {allowUnknown: true});
                break;
            case 3:
                result = electricMotorbikeSchema.validate(req.body, {allowUnknown: true});
                break;
            case 4:
                result = bikeSchema.validate(req.body, {allowUnknown: true});
                break;
            case 5:
                result = scooterSchema.validate(req.body, {allowUnknown: true});
                break;
            default:
                break;
        }

        if(result.error != undefined)
            return next(createHttpError(400, result.error.details[0].message));

        Promise.resolve(staffService.addNewVehicle(req)).then(function(httpError){

            if(httpError != undefined)
                return next(createHttpError(httpError.code, httpError.message));

            res.status(200).send();
        });
    }

}