import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from "typeorm";

import { Booking } from './Booking';

@Entity()
@Unique(["latitude", "longitude"])
export class Stall {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length:100})
    name: string;

	@Column({type: "varchar", length:50})
    address: string;

	@Column({type: "varchar", length:30})
    city: string;

	@OneToMany(() => Booking, booking => booking.user)
    deliveryBookings: Booking[];

	@OneToMany(() => Booking, booking => booking.user)
    returnBookings: Booking[];

}
