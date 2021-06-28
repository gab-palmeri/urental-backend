import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";

import { GasCar } from './GasCar';
import { ElectricCar } from './ElectricCar';
import { GasMotorbike } from './GasMotorbike';
import { ElectricMotorbike } from './ElectricMotorbike';
import { Bike } from './Bike';
import { Scooter } from './Scooter';

@Entity()
export class Vehicle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar",length: 20})
    brand: string;

    @Column({type: "varchar",length: 20})
    model: string;

    @Column({type: "varchar",length: 16})
    serialNumber: string;

    @Column({type: "tinyint"})
    type: number;

    @Column({type: "varchar", length:32})
    imgUrl: string;

    //RELAZIONI ESCLUSIVE: SOLO UNA DI ESSE SARà NOT NULL
    @OneToOne(() => GasCar, gasCar => gasCar.vehicle)
    gasCar: GasCar;

    @OneToOne(() => ElectricCar, electricCar => electricCar.vehicle)
    electricCar: ElectricCar;

    @OneToOne(() => GasMotorbike, gasMotorbike => gasMotorbike.vehicle)
    gasMotorbike: GasMotorbike;

    @OneToOne(() => ElectricMotorbike, electricMotorbike => electricMotorbike.vehicle)
    electricMotorbike: ElectricMotorbike;

    @OneToOne(() => Bike, bike => bike.vehicle)
    bike: Bike;

    @OneToOne(() => Scooter, scooter => scooter.vehicle)
    scooter: Scooter;

}
