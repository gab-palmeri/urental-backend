import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import {User} from "./User";

@Entity()
export class DrivingLicense {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.drivingLicenses)
    user: User;

    @Column({type: "varchar",length: 10})
    licenseNumber: string;

    @Column({type: "date"})
    releaseDate: Date;

    @Column({type: "date"})
    expirationDate: Date;

    @Column({type: "varchar",length: 30})
    releasedFrom: string;

    @Column({type: "boolean"})
    A1: string;

	@Column({type: "boolean"})
    A2: string;

	@Column({type: "boolean"})
    A3: string;

	@Column({type: "boolean"})
    B: string;

}