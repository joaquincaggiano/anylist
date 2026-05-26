import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar', length: 255 })
  //@Field(() => String) no es necesario porque no se expone en la API
  password: string;

  @Column({
    type: 'enum',
    enum: ValidRoles,
    array: true,
    default: [ValidRoles.USER],
  })
  @Field(() => [String])
  roles: ValidRoles[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;
}
