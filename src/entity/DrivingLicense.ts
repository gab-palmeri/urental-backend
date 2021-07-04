import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

import {User} from "./User";

@Entity()
export class DrivingLicense {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.drivingLicense)
	@JoinColumn()
    user: number;

    @Column({type: "varchar",length: 10})
    licenseNumber: string;

    @Column({type: "date"})
    releaseDate: Date;

    @Column({type: "date"})
    expirationDate: Date;

    @Column({type: "varchar",length: 30})
    releasedFrom: string;

    @Column({type: "boolean"})
    A1: boolean;

	@Column({type: "boolean"})
    A2: boolean;

	@Column({type: "boolean"})
    A3: boolean;

	@Column({type: "boolean"})
    B: boolean;

}