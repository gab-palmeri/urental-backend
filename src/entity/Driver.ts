import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()

export class Driver{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 20, nullable: false})
    name: string

    @Column({type: "varchar", length: 20, nullable: false})
    surname: string

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
}