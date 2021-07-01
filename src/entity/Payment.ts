import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Booking } from './Booking';

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length:10})
    price: number;

    @OneToOne(() => Booking, booking => booking.payment)
    @JoinColumn()
    booking: Booking;

}
