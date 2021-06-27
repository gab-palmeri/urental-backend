import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";

import { GasCar } from './GasCar';

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

    @OneToOne(() => GasCar, gasCar => gasCar.idVehicle)
    gasCar: Promise<GasCar>;

    // @OneToOne(() => ElectricCar, electricCar => electricCar.idVehicle)
    // electricCar: ElectricCar;





}
