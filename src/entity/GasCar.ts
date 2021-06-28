import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Vehicle } from './Vehicle';

@Entity()
export class GasCar {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar",length: 20, unique:true})
    licensePlate: string;

    @Column({type: "smallint"})
    displacement: number;

    @Column({type: "smallint"})
    kilowatt: number;

    @Column({type: "tinyint"})
    seats: number;

    @Column({type: "varchar", length:20})
    category: string;

    @Column({type: "varchar", length:20})
    consumption: string;

    @Column({type: "varchar", length:10})
    trunkSize: string;

    @Column({type: "bool"})
    shift: boolean;

    @Column({type: "tinyint"})
    euro: number;

    @Column({type: "varchar", length:16})
    fuel: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.gasCar, { eager: true })
    @JoinColumn()
    vehicle: Vehicle;





}