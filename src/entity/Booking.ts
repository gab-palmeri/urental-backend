import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";

import { Vehicle } from './Vehicle';
import { Driver } from './Driver';
import { User } from './User';

import { Payment } from './Payment';
//import { Status } from './Status';

@Entity()
export class Booking {

    @PrimaryGeneratedColumn()
    id: number;

	@ManyToOne(() => Driver, driver => driver.bookings)
    driver: Driver;
    
	@ManyToOne(() => Vehicle, vehicle => vehicle.bookings, {nullable:false})
    vehicle: Vehicle;

	@ManyToOne(() => User, user => user.bookings, {nullable:false})
    user: User;

	@OneToOne(() => Booking, booking => booking.payment, {nullable:false})
    payment: Payment;

	//MANCANO STATUS

	@Column({type: "timestamp"})
    bookingTimestamp: string;

	@Column({type: "date"})
    deliveryDate: string;

	@Column({type: "time"})
    deliveryTime: string;

	@Column({type: "varchar", length:32})
    deliveryPlace: string;

	@Column({type: "varchar", length:32})
    duration: string;

	@Column({type: "date"})
    returnDate: string;

	@Column({type: "time"})
    returnTime: string;

	@Column({type: "varchar", length:32})
    returnPlace: string;

}
