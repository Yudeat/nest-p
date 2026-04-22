import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile{
    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id',
    })
    id:number;

    @Column({
        type:'varchar',
        length:20,
        name:'name',
        nullable:false,
    })
    name:string;

    @Column({
        type:'varchar',
        length:255,
        name:'desc',
        nullable:false,
    })
    desc:string;

    @Column({
        type:'varchar',
        length:255,
        name:'location',
        nullable:false,
    
    })
    location:string;

    @CreateDateColumn({
        type:'timestamp',
        name:'created_at',
        nullable:false,
        default:()=>'CURRENT_TIMESTAMP',
    })
    createdAt:Date;

    @CreateDateColumn({
        type:'timestamp',
        name:'updated_at',
        nullable:false,
        default:()=>'CURRENT_TIMESTAMP',
        onUpdate:'CURRENT_TIMESTAMP',})
    updatedAt:Date;


    
}