import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Booking } from './Booking';

@Entity()
export class Stall {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length:100})
    name: string;

	@Column({type: "varchar", length:50})
    address: string;

	@Column({type: "varchar", length:30})
    city: string;

	@OneToMany(() => Booking, booking => booking.pickUpStall)
    pickUpBookings: Booking[];

	@OneToMany(() => Booking, booking => booking.deliveryStall)
    deliveryBookings: Booking[];

	

}
