import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Vehicle } from './Vehicle';

@Entity()
export class VehiclePhoto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length:32})
    imgUrl: string;

    @ManyToOne(() => Vehicle, vehicle => vehicle.photos)
    vehicle: Vehicle;

}
