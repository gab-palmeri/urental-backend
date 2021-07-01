import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Vehicle } from './Vehicle';

@Entity()
export class ElectricMotorbike {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar",length: 20, unique:true})
    licensePlate: string;

    @Column({type: "smallint"})
    capacity: number;

    @Column({type: "float"})
    kilowatt: number;

    @Column({type: "varchar", length:30})
    category: string;

    @Column({type: "varchar", length:30})
    consumption: string;

    @Column({type: "varchar", length:30})
    batteryCapacity: string;

    @Column({type: "varchar", length:10})
    chargeDuration: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.electricMotorbike)
    @JoinColumn()
    vehicle: Vehicle;





}
