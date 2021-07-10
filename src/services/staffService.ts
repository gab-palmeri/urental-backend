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

import * as tokenService from "./tokenService";

export async function authStaff(email: string, password: string) : Promise<any>{

	var staff;

	try {

		 staff = await getRepository(Staff).findOne({where: {"email": email}})
	} catch (error) {
		
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}

    if(staff == null || !bcrypt.compareSync(password, staff.password))
        return {httpError: {code: 400, message: "Email o password invalidi"}, token: undefined};

	let privateKEY;

	try {

		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");
	} catch (error) {

		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}

    let token = jwt.sign({
        "id": staff.id,
        "role": 2
    }, privateKEY, jwtSettings);

    return {httpError: undefined, token: token};
}

export async function createStaff(staffPayload: any) : Promise<any>{

    const token = staffPayload.headers.authorization.split(" ")[1];
    let isStaff = tokenService.isStaff(token);

    if(!isStaff)
        return {httpError: {code: 401, message: "Non hai i permessi per effettuare questa richiesta"}};

    let staff = new Staff();

    staff.name = converToCapitalizedCase(staffPayload.body.name);
    staff.surname = converToCapitalizedCase(staffPayload.body.surname);
    staff.fiscalCode = staffPayload.body.fiscalCode;
    staff.birthDate = staffPayload.body.birthDate;
    staff.birthPlace = converToCapitalizedCase(staffPayload.body.birthPlace);
    staff.email = staffPayload.body.email;
    staff.password = bcrypt.hashSync(staffPayload.body.password, 8);

    try{
        await getRepository(Staff).save(staff);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {httpError: {code: 400, message: "Staff già esistente."}};
        else
            return {httpError: {code: 500, message: "Errore interno al server"}};
    }

    return undefined;
}

export async function addNewVehicle(addNewVehiclePayload : any, photosPaths) : Promise<any>{

    const token = addNewVehiclePayload.headers.authorization.split(" ")[1];
	let isStaff = tokenService.isStaff(token);

    if(!isStaff)
        return {httpError: {code: 401, message: "Non hai i permessi per effettuare questa richiesta"}};

    let vehicle = new Vehicle();
    vehicle.brand = addNewVehiclePayload.body.brand;
    vehicle.model = addNewVehiclePayload.body.model;
    vehicle.serialNumber = addNewVehiclePayload.body.serialNumber;
    vehicle.type = addNewVehiclePayload.body.type;
    vehicle.hourlyPrice = addNewVehiclePayload.body.hourlyPrice;
    vehicle.dailyPrice = addNewVehiclePayload.body.dailyPrice;

    if(addNewVehiclePayload.body.driverPrice != undefined)
        vehicle.driverPrice = addNewVehiclePayload.body.driverPrice

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

    try{
        await getRepository(Vehicle).save(vehicle);
    }
    catch(err){

        if(err.code == "ER_DUP_ENTRY")
            return {httpError: {code: 400, message: "Vehicle già esistente."}};
        else{
            console.log(err);
            return {httpError: {code: 500, message: "Errore interno al server"}};
        }

    }

    return {httpError: undefined};
}


export async function getStaffBy(staffID: number): Promise<any> {

    try {
        const staff = await getRepository(Staff).findOne({
            where: { id: staffID}
        });

        if(staff != undefined)
            return { httpError: undefined, staff: staff}
        else
            return { httpError: {code: 404, message: "Staff non trovato"}, staff: undefined};

    }
    catch (err) {
        return {httpError: {code: 500, message:"Errore interno al server"}, staff: undefined};
    }
}

function converToCapitalizedCase(words: string): string {
	
	const wordsArray = words.toLowerCase().split(" ");

    for (var i = 0; i < wordsArray.length; i++)
        wordsArray[i] = wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].slice(1);

    return wordsArray.join(" ");
}