import { getRepository } from "typeorm";
import { Vehicle } from '../entity/Vehicle';
import { GasCar } from '../entity/GasCar';
import { ElectricCar } from '../entity/ElectricCar';
import { GasMotorbike } from '../entity/GasMotorbike';
import { ElectricMotorbike } from '../entity/ElectricMotorbike';
import { Bike } from '../entity/Bike';
import { Scooter } from '../entity/Scooter';


export async function getPreview(): Promise<any> {

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

        return {httpError: undefined, vehiclesData: [cars,motorbikes,bike,scooter]}

    } catch(err)
    {
        return {httpError: {code:500, message:"Errore interno al server"}, vehicleData: undefined}
    }
}

export async function getCars(): Promise<any> {

    try {

        const cars = await getRepository(Vehicle).createQueryBuilder("vehicle")
            .select(['brand', 'model', 'imgUrl'])
            .where("vehicle.type >= 0")
            .andWhere("vehicle.type <= 1")
            .groupBy("vehicle.brand")
            .addGroupBy("vehicle.model")
            .getRawMany();

        return {httpError: undefined, carsData: cars}

    } catch (err) {
        return {httpError: {code:500, message:"Errore interno al server"}, carsData: undefined}
    }
}

export async function getMotorbikes(): Promise<any> {
    try {
        const motorbikes = await getRepository(Vehicle).createQueryBuilder("vehicle")
            .select(['brand', 'model', 'imgUrl'])
            .where("vehicle.type >= 2")
            .andWhere("vehicle.type <= 3")
            .groupBy("vehicle.brand")
            .addGroupBy("vehicle.model")
            .getRawMany();

        return {httpError: undefined, motorbikesData: motorbikes}

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
