import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import { Staff } from "./Staff"
import { Booking } from "./Booking"
import {Stall} from "./Stall";

@Entity()

export class Status{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    description: string;

    @ManyToOne(() => Staff, staffPickup => staffPickup.pickupStatus)
    staffPickup: Stall;

    @ManyToOne(() => Staff, staffDelivery => staffDelivery.deliveryStatus)
    staffDelivery: Stall;

    @OneToOne(() => Booking, booking => booking.status)
    booking: Booking;
}