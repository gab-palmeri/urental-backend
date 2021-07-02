import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Booking } from './Booking';

@Entity()
export class Stall {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length:30})
    name: string;

	@Column({type: "varchar", length:30})
    address: string;

	@Column({type: "varchar", length:30})
    city: string;

	@Column({type: "text"})
    latitude: string;

	@Column({type: "text"})
    longitude: string;

	@OneToMany(() => Booking, booking => booking.user)
    deliveryBookings: Booking[];

	@OneToMany(() => Booking, booking => booking.user)
    returnBookings: Booking[];

}
