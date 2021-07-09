import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import { Staff } from "./Staff"

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
}