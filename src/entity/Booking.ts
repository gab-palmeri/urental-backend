import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";

import { Vehicle } from './Vehicle';
import { Driver } from './Driver';
import { User } from './User';

import { Payment } from './Payment';
import { Stall } from './Stall';
//import { Status } from './Status';

@Entity()
export class Booking {

	//MANCA STATUS

    @PrimaryGeneratedColumn()
    id: number;

	//RELATIONS

	@ManyToOne(() => Driver, driver => driver.bookings)
    driver: Driver;
    
	@ManyToOne(() => Vehicle, vehicle => vehicle.bookings, {nullable:false})
    vehicle: Vehicle;

	@ManyToOne(() => User, user => user.bookings, {nullable:false})
    user: User;

	@ManyToOne(() => Stall, stall => stall.deliveryBookings, {nullable:false})
    deliveryStall: Stall;

	@ManyToOne(() => Stall, stall => stall.returnBookings, {nullable:false})
    returnStall: Stall;

	@OneToOne(() => Booking, booking => booking.payment, {nullable:false})
    payment: Payment;

	//DATA

	@Column({type: "timestamp"})
    bookingTimestamp: string;

	@Column({type: "date"})
    deliveryDate: string;

	@Column({type: "time"})
    deliveryTime: string;

	@Column({type: "tinyint", length:32})
    duration: number;

	@Column({type: "date"})
    returnDate: string;

	@Column({type: "time"})
    returnTime: string;

}
