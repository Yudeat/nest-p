import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude} from "class-transformer";
// seralization and deserialization of objects, allowing you to control which properties are 
// included or excluded when converting an object to JSON or when creating an object from JSON.
//  By using @Exclude() on the 'desc' field, we can ensure that it will not be included in the 
// serialized output when the Profile entity is converted to JSON,
//  while still allowing it to be stored in the database and used within the application logic.
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
// Using @Exclude to prevent the 'desc' field from being included in the serialized output
 @Exclude()
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

    constructor(partial:Partial<Profile>){
        Object.assign(this,partial);
    }

    
}