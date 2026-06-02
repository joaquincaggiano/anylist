import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new BadRequestException('We cannot run seed on production');
    }
    // Purgamos la base de datos
    await this.deleteDatabase();

    // Cargamos los usuarios
    const user = await this.loadUsers();

    // Cargamos los items
    await this.loadItems(user);

    const list = await this.loadLists(user);

    const items = await this.itemsService.findAll(user, {
      limit: 15,
      offset: 0,
    });
    await this.loadListItems(list, items, user);

    return true;
  }

  async deleteDatabase() {
    await this.listItemsRepository.createQueryBuilder().delete().execute();
    await this.listsRepository.createQueryBuilder().delete().execute();
    await this.itemsRepository.createQueryBuilder().delete().execute();
    await this.usersRepository.createQueryBuilder().delete().execute();
  }

  async loadUsers(): Promise<User> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User) {
    const items: Item[] = [];

    for (const item of SEED_ITEMS) {
      items.push(await this.itemsService.create(item, user));
    }

    return items;
  }

  async loadLists(user: User): Promise<List> {
    const lists: List[] = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Item[], user: User) {
    for (const item of items) {
      await this.listItemsService.create(
        {
          quantity: Math.round(Math.random() * 10),
          completed: Math.round(Math.random() * 1) === 1,
          listId: list.id,
          itemId: item.id,
        },
        user,
      );
    }
  }
}
