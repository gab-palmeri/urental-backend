import { Request, Response } from "express";
import createHttpError from "http-errors";

import { staffAndDriverSchema as staffSchema } from "../schemas/StaffAndDriverSchema";
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
import fs from "fs";


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

    public async addNewVehicle(req, res: Response, next: any){

        let { error, value } = vehicleSchema.validate(req.body, { allowUnknown: true });

        if(error != undefined)
            return next(createHttpError(400, error.details[0].message));

        if(typeof req.body.features === "string")
            req.body.features = JSON.parse(req.body.features);
        else
            return next(createHttpError(400, "formato features invalido"));

        let result;
        switch (req.body.type){
            case "0":
                result  = gasCarSchema.validate(req.body, { allowUnknown: true });
                break;
            case "1":
                result = electricCarSchema.validate(req.body, { allowUnknown: true });
                break;
            case "2":
                result = gasMotorbikeSchema.validate(req.body, { allowUnknown: true });
                break;
            case "3":
                result = electricMotorbikeSchema.validate(req.body, { allowUnknown: true });
                break;
            case "4":
                result = bikeSchema.validate(req.body, { allowUnknown: true });
                break;
            case "5":
                result = scooterSchema.validate(req.body, { allowUnknown: true });
                break;
            default:
                break;
        }

        if(result.error != undefined)
            return next(createHttpError(400, result.error.details[0].message));

        let prefixPaths = prefixPathPhotos(req.body);

        req.dirPath = prefixPaths

        switch (req.body.type){
            case "0":
            case "1":
            case "2":
            case "3":
                prefixPaths += req.body.serialNumber + "-";
                break;
            default:
                break;
        }

        if(["4", "5"].includes(req.body.type)){

            try{
                let files = fs.readdirSync(prefixPaths);

                req.destionationPaths = []

                files.reverse().forEach(file => {
                    req.destionationPaths.push(prefixPaths + file);
                });
            }catch(e){
                return next(createHttpError(400, "Bike o Scooter non convenzionato"));
            }
        }
        else{
            req.destionationPaths = [
                prefixPaths + "main" + req.destionationPaths[0],
                prefixPaths + "1" + req.destionationPaths[1],
                prefixPaths + "2" + req.destionationPaths[2],
            ];
        }

        let httpError = await Promise.resolve(staffService.addNewVehicle(req, req.destionationPaths.map(path => {
            return path.replace("assets", "");
        })));

        if(httpError != undefined)
            return next(createHttpError(httpError.code, httpError.message));
        else
            next();
    }
}


function prefixPathPhotos(vehicle){

    let output = "assets/";

    switch (vehicle.type) {
        case "0":
        case "1":
            output += "cars/" + vehicle.brand + "-" + vehicle.model + "/" + vehicle.serialNumber + "/"
            break;
        case "2":
        case "3":
            output += "motorbikes/" + vehicle.brand + "-" + vehicle.model + "/" + vehicle.serialNumber + "/"
            break;
        case "4":
            output += "bikes/" + vehicle.brand + "-" + vehicle.model + "/"
            break;
        case "5":
            output += "scooters/" + vehicle.brand + "-" + vehicle.model + "/"
            break;
        default:
            break;
    }

    return output;
}