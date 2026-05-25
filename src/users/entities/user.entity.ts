import { ObjectType, Field, ID } from '@nestjs/graphql';
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

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String])
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;
}
