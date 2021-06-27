import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Vehicle } from './Vehicle';

@Entity()
export class GasMotorbike {

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

    @Column({type: "bool"})
    shift: boolean;

    @Column({type: "tinyint"})
    euro: number;

    @Column({type: "varchar", length:16})
    fuel: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.gasMotorbike, { eager: true })
    @JoinColumn()
    vehicle: Vehicle;

}
