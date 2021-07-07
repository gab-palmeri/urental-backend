import {getRepository} from "typeorm";
import {jwtSettings} from "../jwtsettings";

import * as bcrypt from "bcryptjs";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";

import {Staff} from "../entity/Staff";
import {Vehicle} from "../entity/Vehicle";
import {GasCar} from "../entity/GasCar";
import {ElectricCar} from "../entity/ElectricCar";
import {GasMotorbike} from "../entity/GasMotorbike";
import {ElectricMotorbike} from "../entity/ElectricMotorbike";
import {Bike} from "../entity/Bike";
import {Scooter} from "../entity/Scooter";
import {VehiclePhoto} from "../entity/VehiclePhoto";

export async function authStaff(email: string, password: string) : Promise<any>{

    const staff = await getRepository(Staff).findOne({where: {"email": email}})

    if(staff == null || !bcrypt.compareSync(password, staff.password))
        return {httpError: {code: 400, message: "Email o password invalidi"}, token: undefined};

    let privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

    let token = jwt.sign({
        "id": staff.id,
        "role": 2
    }, privateKEY, jwtSettings);

    return {httpError: undefined, token: token};
}

export async function createStaff(staffPayload: any) : Promise<any>{

    const token = staffPayload.headers.authorization.split(" ")[1];
    let httpError = verifyRoleFromToken(token);

    if(httpError != undefined)
        return httpError;

    let staff = new Staff();

    staff.name = staffPayload.body.name;
    staff.surname = staffPayload.body.surname;
    staff.fiscalCode = staffPayload.body.fiscalCode;
    staff.birthDate = staffPayload.body.birthDate;
    staff.birthPlace = staffPayload.body.birthPlace;
    staff.email = staffPayload.body.email;
    staff.password = bcrypt.hashSync(staffPayload.body.password, 8);

    try{
        await getRepository(Staff).save(staff);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {code: 400, message: "Staff già esistente."};
        else
            return {code: 500, message: "Errore interno al server"};
    }

    return undefined;
}

function verifyRoleFromToken(token: any) : object{

    let publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
    let decodedToken = jwt.verify(token, publicKEY);

    if(decodedToken["role"] != 2)
        return {code: 401, message: "Non hai i permessi per effettuare questa richiesta"};

    return undefined;
}

export async function addNewVehicle(addNewVehiclePayload : any, photosPaths) : Promise<any>{

    const token = addNewVehiclePayload.headers.authorization.split(" ")[1];
    let httpError = verifyRoleFromToken(token);

    if(httpError != undefined)
        return httpError;

    let vehicle = new Vehicle();
    vehicle.brand = addNewVehiclePayload.body.brand;
    vehicle.model = addNewVehiclePayload.body.model;
    vehicle.serialNumber = addNewVehiclePayload.body.serialNumber;
    vehicle.type = addNewVehiclePayload.body.type;

    vehicle.mainImage = photosPaths[0];
    vehicle.photos = photosPaths.slice(1).map((photoURL : string) => {
        let vehiclePhoto = new VehiclePhoto();
        vehiclePhoto.imgUrl = photoURL;
        return vehiclePhoto;
    });

    switch (addNewVehiclePayload.body.type) {
        case "0":

            let gasCar = new GasCar();

            Object.keys(addNewVehiclePayload.body.features).forEach(function(key){
                gasCar[key] = addNewVehiclePayload.body.features[key];
            });

            vehicle.gasCar = Promise.resolve(gasCar);
            break;
        case "1":

            let electricCar = new ElectricCar();

            Object.keys(addNewVehiclePayload.body.features).forEach(function(key){
                electricCar[key] = addNewVehiclePayload.body.features[key];
            });

            vehicle.electricCar = Promise.resolve(electricCar);
            break;
        case "2":
            let gasMotorbike = new GasMotorbike();

            Object.keys(addNewVehiclePayload.body.features).forEach(function(key){
                gasMotorbike[key] = addNewVehiclePayload.body.features[key];
            });

            vehicle.gasMotorbike = Promise.resolve(gasMotorbike);
            break;
        case "3":
            let electricMotorbike = new ElectricMotorbike();

            Object.keys(addNewVehiclePayload.body.features).forEach(function(key){
                electricMotorbike[key] = addNewVehiclePayload.body.features[key];
            });

            vehicle.electricMotorbike = Promise.resolve(electricMotorbike);
            break;
        case "4":
            let bike = new Bike();

            Object.keys(addNewVehiclePayload.body.features).forEach(function(key){
                bike[key] = addNewVehiclePayload.body.features[key];
            });

            vehicle.bike = Promise.resolve(bike);
            break;
        case "5":
            let scooter = new Scooter();

            Object.keys(addNewVehiclePayload.body.features).forEach(function(key){
                scooter[key] = addNewVehiclePayload.body.features[key];
            });

            vehicle.scooter = Promise.resolve(scooter);
            break;
        default:
            break;
    }

    vehicle.hourlyPrice = 1.1
    vehicle.dailyPrice = 1.2
    vehicle.driverPrice = 1.3

    try{
        console.log("*************** vehicle ***************");
        console.log(vehicle);
        await getRepository(Vehicle).save(vehicle);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {code: 400, message: "Vehicle già esistente."};
        else{
            console.log("*********************** err *********************");
            console.log(err)
            return {code: 500, message: "Errore interno al server"};
        }

    }

    return undefined;
}
