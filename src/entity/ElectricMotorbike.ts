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

    @Column({type: "smallint"})
    kilowatt: number;

    @Column({type: "varchar", length:20})
    category: string;

    @Column({type: "varchar", length:20})
    consumption: string;

    @Column({type: "varchar", length:10})
    batteryCapacity: string;

    @Column({type: "varchar", length:3})
    chargeDuration: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.electricMotorbike, { eager: true })
    @JoinColumn()
    vehicle: Vehicle;





}
