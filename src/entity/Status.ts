import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import { Staff } from "./Staff"
import { StatusPhoto } from "./StatusPhoto";

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

    /*@OneToMany(() => StatusPhoto, StatusPhoto => StatusPhoto.status, {cascade : true})
    photos: StatusPhoto[];*/
}