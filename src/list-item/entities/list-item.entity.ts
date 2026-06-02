import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'listItems' })
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'integer' })
  @Field(() => Int)
  quantity: number;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItems, {
    nullable: false,
    lazy: true,
  })
  @Index('listId-index')
  @JoinColumn({ name: 'listId' })
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItems, {
    nullable: false,
    lazy: true,
  })
  @Index('itemId-index')
  @JoinColumn({ name: 'itemId' })
  @Field(() => Item)
  item: Item;
}
