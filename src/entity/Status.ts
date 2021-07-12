import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import { Staff } from "./Staff"
import { Booking } from "./Booking"

@Entity()

export class Status{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    description: string;

    @OneToOne(() => Staff, staff => staff.id)
    @JoinColumn()
    staffPickup: Staff;

    @OneToOne(() => Staff, staff => staff.id)
    @JoinColumn()
    staffDelivery: Staff;

    @OneToOne(() => Booking, booking => booking.id)
    @JoinColumn()
    booking: Booking;
}