import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";

import { GasCar } from './GasCar';
import { ElectricCar } from './ElectricCar';
import { GasMotorbike } from './GasMotorbike';
import { ElectricMotorbike } from './ElectricMotorbike';
import { Bike } from './Bike';
import { Scooter } from './Scooter';

import { VehiclePhoto } from './VehiclePhoto';
import { Booking } from './Booking';

@Entity()
export class Vehicle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar",length: 20})
    brand: string;

    @Column({type: "varchar",length: 20})
    model: string;

    @Column({type: "varchar",length: 16, unique:true})
    serialNumber: string;

    @Column({type: "tinyint"})
    type: number;

    @Column({type: "text"})
    mainImage: string;

	@Column({type: "float"})
    hourlyPrice: number;

	@Column({type: "float"})
    dailyPrice: number;

	@Column({type: "float", default: -1})
    driverPrice: number;

    @OneToMany(() => VehiclePhoto, photo => photo.vehicle, {cascade : true})
    photos: VehiclePhoto[];

	@OneToMany(() => Booking, booking => booking.vehicle)
    bookings: Booking[];

    //RELAZIONI ESCLUSIVE: SOLO UNA DI ESSE SARà NOT NULL
    @OneToOne(() => GasCar, gasCar => gasCar.vehicle, {cascade : true})
    gasCar: Promise<GasCar>;

    @OneToOne(() => ElectricCar, electricCar => electricCar.vehicle, {cascade : true})
    electricCar: Promise<ElectricCar>;

    @OneToOne(() => GasMotorbike, gasMotorbike => gasMotorbike.vehicle, {cascade : true})
    gasMotorbike: Promise<GasMotorbike>;

    @OneToOne(() => ElectricMotorbike, electricMotorbike => electricMotorbike.vehicle, {cascade : true})
    electricMotorbike: Promise<ElectricMotorbike>;

    @OneToOne(() => Bike, bike => bike.vehicle, {cascade : true})
    bike: Promise<Bike>;

    @OneToOne(() => Scooter, scooter => scooter.vehicle, {cascade : true})
    scooter: Promise<Scooter>;

}
