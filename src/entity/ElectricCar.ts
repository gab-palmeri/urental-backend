import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Vehicle } from './Vehicle';

@Entity()
export class ElectricCar {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar",length: 20, unique:true})
    licensePlate: string;

    @Column({type: "float"})
    kilowatt: number;

    @Column({type: "tinyint"})
    seats: number;

    @Column({type: "varchar", length:30})
    category: string;

    @Column({type: "varchar", length:30})
    consumption: string;

    @Column({type: "varchar", length:30})
    trunkSize: string;

    @Column({type: "varchar", length:30})
    batteryCapacity: string;

    @Column({type: "varchar", length:3})
    chargeDuration: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.electricCar)
    @JoinColumn()
    vehicle: Vehicle;





}
