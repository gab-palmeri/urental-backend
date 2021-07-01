import { getRepository, In } from "typeorm";
import { Vehicle } from '../entity/Vehicle';
import { GasCar } from '../entity/GasCar';
import { ElectricCar } from '../entity/ElectricCar';
import { GasMotorbike } from '../entity/GasMotorbike';
import { ElectricMotorbike } from '../entity/ElectricMotorbike';
import { Bike } from '../entity/Bike';
import { Scooter } from '../entity/Scooter';

export async function getPreview(): Promise<any> {

    try {

        const vehicles = await getRepository(Vehicle).find({
            select: ["brand","model","type","main_image"]
        });

        var noDuplicatesVehicles = await removeDuplicateVehicles(vehicles);

        //Dividing the query result into 4 sections (cars,motorbikes,bike,scooter)
        const cars = noDuplicatesVehicles.filter(vehicle => vehicle.type >= 0 && vehicle.type <= 1);
        const motorbikes = noDuplicatesVehicles.filter(vehicle => vehicle.type >= 2 && vehicle.type <= 3);

        //We will have one brand/model for bikes and one brand/model for scooters => one item each
        const bike = noDuplicatesVehicles.filter(vehicle => vehicle.type == 4);
        const scooter = noDuplicatesVehicles.filter(vehicle => vehicle.type == 5);

        return {httpError: undefined, vehiclesData: [cars,motorbikes,bike,scooter]}

    } catch(err)
    {
        return {httpError: {code:500, message:"Errore interno al server"}, vehicleData: undefined}
    }
}

export async function getCars(): Promise<any> {

    try {

        const cars = await getRepository(Vehicle).find({
            select: ["brand","model","main_image"],
            where: { type: In([0,1])}
        });

        var noDuplicatesCars = await removeDuplicateVehicles(cars);

        return {httpError: undefined, carsData: noDuplicatesCars}

    } catch (err) {
        return {httpError: {code:500, message:"Errore interno al server"}, carsData: undefined}
    }
}

export async function getMotorbikes(): Promise<any> {
    try {

        const motorbikes = await getRepository(Vehicle).find({
            select: ["brand","model","main_image"],
            where: { type: In([2,3])}
        });

        var noDuplicatesMotorbikes = await removeDuplicateVehicles(motorbikes);

        return {httpError: undefined, motorbikesData: noDuplicatesMotorbikes}

    } catch (error) {
        return {httpError: {code:500, message:"Errore interno al server"}, motorbikesData: undefined}
    }

}

export async function getVehiclesByBrandAndModel(brand: string, model: string): Promise<any> {

    try {
        var vehicles = await getRepository(Vehicle).find({ where: { brand: brand, model: model } });

        return {httpError: undefined, vehiclesData: vehicles}

    } catch (error) {
        return {httpError: {code:500, message:"Errore interno al server"}, vehiclesData: undefined}
    }

}

async function removeDuplicateVehicles(vehicles: Vehicle[])
{
    var hashesFound = {};

    vehicles.forEach(function(vehicle){
        hashesFound[vehicle.brand + "-" + vehicle.model] = vehicle;
    })

    return Object.keys(hashesFound).map(function(k){
        return hashesFound[k];
    })
}
