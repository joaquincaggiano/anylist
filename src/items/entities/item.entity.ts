import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits: string | null; // ml, g, kg, etc.

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  category: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @JoinColumn({ name: 'listItems' })
  @Field(() => [ListItem])
  listItems: ListItem[];
}
