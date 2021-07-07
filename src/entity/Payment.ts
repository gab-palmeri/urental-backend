import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import { Booking } from './Booking';

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float"})
    total: number;

	@Column({type: "varchar", length:10})
    paymentCode: string;

    @OneToOne(() => Booking, booking => booking.payment)
    booking: Booking;

}
