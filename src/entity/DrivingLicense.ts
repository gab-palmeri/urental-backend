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
    expiryDate: Date;

    @Column({type: "varchar",length: 30})
    releasedFrom: string;

    @Column({type: "varchar",length: 3})
    licenseCategory: string;

}
