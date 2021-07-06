import { getRepository, In } from "typeorm";
import { Vehicle } from '../entity/Vehicle';

export async function getPreview(): Promise<any> {

    try {

        const vehicles = await getRepository(Vehicle).find({
            select: ["brand","model","type","mainImage"]
        });

        var noDuplicatesVehicles = removeDuplicateVehicles(vehicles);

        //Dividing the query result into 4 sections (cars,motorbikes,bike,scooter)
        const cars = noDuplicatesVehicles.filter(vehicle => vehicle.type >= 0 && vehicle.type <= 1);
        const motorbikes = noDuplicatesVehicles.filter(vehicle => vehicle.type >= 2 && vehicle.type <= 3);

        //We will have one brand/model for bikes and one brand/model for scooters => one item each
        const bike = noDuplicatesVehicles.filter(vehicle => vehicle.type == 4);
        const scooter = noDuplicatesVehicles.filter(vehicle => vehicle.type == 5);

        return {httpError: undefined, vehiclesData: {cars: cars, motorbikes: motorbikes, bike: bike, scooter: scooter}}

    } catch(err)
    {
        return {httpError: {code:500, message:"Errore interno al server"}, vehicleData: undefined}
    }
}

export async function getCars(): Promise<any> {

    try {

        const cars = await getRepository(Vehicle).find({
            select: ["brand","model","mainImage"],
            where: { type: In([0,1])}
        });

        var noDuplicatesCars = removeDuplicateVehicles(cars);

        return {httpError: undefined, carsData: noDuplicatesCars}

    } catch (err) {
        return {httpError: {code:500, message:"Errore interno al server"}, carsData: undefined}
    }
}

export async function getMotorbikes(): Promise<any> {
    try {

        const motorbikes = await getRepository(Vehicle).find({
            select: ["brand","model","mainImage"],
            where: { type: In([2,3])}
        });

        var noDuplicatesMotorbikes = removeDuplicateVehicles(motorbikes);

        return {httpError: undefined, motorbikesData: noDuplicatesMotorbikes}

    } catch (error) {
        return {httpError: {code:500, message:"Errore interno al server"}, motorbikesData: undefined}
    }

}

export async function getVehiclePrices(serialNumber: string): Promise<any> {

	try {

        const vehiclePrices = await getRepository(Vehicle).find({
            select: ["serialNumber", "hourlyPrice", "dailyPrice", "driverPrice"],
            where: { serialNumber: serialNumber}
        });

		if(vehiclePrices.length == 0)
			return {httpError: {code:404, message:"Veicolo non trovato"}, vehiclePrices: undefined}

        return {httpError: undefined, vehiclePrices: vehiclePrices}

    } catch (error) {
        return {httpError: {code:500, message:"Errore interno al server"}, vehiclePrices: undefined}
    }
}

export async function getVehiclesByBrandAndModel(brand: string, model: string): Promise<any> {

    try {
        var vehicles = await getRepository(Vehicle).find({ where: { brand: brand, model: model }, relations: ["photos"] });

        if(vehicles.length == 0)
            return {httpError: {code: 404, message : "Non esiste nessun veicolo con il brand e model specificati"}, vehiclesData: undefined};

        return {httpError: undefined, vehiclesData: vehicles}
    } catch (error) {

        return {httpError: {code:500, message:"Errore interno al server"}, vehiclesData: undefined}
    }
}

function removeDuplicateVehicles(vehicles: Vehicle[])
{
    var hashesFound = {};

    vehicles.forEach(function(vehicle){
        hashesFound[vehicle.brand + "-" + vehicle.model] = vehicle;
    })

    return Object.keys(hashesFound).map(function(k){
        return hashesFound[k];
    })
}
