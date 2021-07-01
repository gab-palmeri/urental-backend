import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { DrivingLicense } from "./DrivingLicense";
import { Booking } from "./Booking";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 20, nullable: false})
    name: string;

    @Column({type: "varchar", length: 20, nullable: false})
    surname: string;

    @Column({type: "varchar", length: 16, nullable: false, unique: true})
    fiscalCode: string;

    @Column({type: "date", nullable: false})
    birthDate: Date;

    @Column({type: "varchar", length: 32, nullable: false})
    birthPlace: string;

    @Column({type: "varchar", length: 32, nullable: false, unique: true})
    email: string;

    @Column({type: "text", nullable: false})
    password: string;

    @Column({type: "bool", nullable: false})
    active: number;

    @Column({type: "varchar", length:4, nullable: true})
    pin: string;

    //RELAZIONI

    @OneToMany(() => DrivingLicense, drivingLicense => drivingLicense.user, {cascade: true})
    drivingLicenses: DrivingLicense[];

	@OneToMany(() => Booking, booking => booking.user)
    bookings: Booking[];

}
