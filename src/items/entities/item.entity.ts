import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  name: string;

  @Column({ type: 'float' })
  @Field(() => Float)
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string; // ml, g, kg, etc.

  @ManyToOne(() => User, (user) => user.items, { nullable: false })
  @Index('userId-index')
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;
}
