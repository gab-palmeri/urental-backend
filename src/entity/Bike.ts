import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Vehicle } from './Vehicle';

@Entity()
export class Bike {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length:10})
    batteryCapacity: string;

    @Column({type: "varchar", length:3})
    chargeDuration: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.bike)
    @JoinColumn()
    vehicle: Vehicle;





}
