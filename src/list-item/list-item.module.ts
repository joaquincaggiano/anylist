import { Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListItem, List, Item])],
  providers: [ListItemResolver, ListItemService],
  exports: [ListItemService, TypeOrmModule],
})
export class ListItemModule {}
