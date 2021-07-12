import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";

import { Vehicle } from './Vehicle';
import { Driver } from './Driver';
import { User } from './User';

import { Payment } from './Payment';
import { Stall } from './Stall';
import { Status } from './Status';

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
    pickUpStall: Stall;

	@ManyToOne(() => Stall, stall => stall.pickUpBookings, {nullable:false})
    deliveryStall: Stall;

	@OneToOne(() => Payment, payment => payment.booking, {nullable:false, cascade : true})
    @JoinColumn()
	payment: Payment;

    @OneToOne(() => Status, status => status.id, {cascade: true})
    @JoinColumn()
    status: Status;

	//DATA

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    bookingTimestamp: string;

	@Column({type: "datetime"})
    pickUpDateTime: Date;

	@Column({type: "datetime"})
    deliveryDateTime: Date;

}
