import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { List } from 'src/lists/entities/list.entity';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { CreateListItemInput } from './dto/inputs';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(
    createListItemInput: CreateListItemInput,
    user: User,
  ): Promise<ListItem> {
    const { listId, itemId, quantity, completed } = createListItemInput;
    const list = await this.listRepository.findOne({
      where: { id: listId, user: { id: user.id } },
    });
    const item = await this.itemRepository.findOne({
      where: { id: itemId, user: { id: user.id } },
    });
    if (!list || !item) {
      throw new NotFoundException(
        `List or item with id ${listId} or ${itemId} not found`,
      );
    }
    const listItem = this.listItemRepository.create({
      list,
      item,
      quantity,
      completed,
    });
    return await this.listItemRepository.save(listItem);
  }

  async findAll(
    listId: string,
    paginationArgs: PaginationArgs,
  ): Promise<ListItem[]> {
    const { limit = 10, offset = 0, search } = paginationArgs;
    return await this.listItemRepository.find({
      skip: offset,
      take: limit,
      where: { list: { id: listId } },
      ...(search && { item: { name: ILike(`%${search}%`) } }),
    });
  }

  async countListItemsByList(listId: string): Promise<number> {
    return await this.listItemRepository.count({
      where: { list: { id: listId } },
    });
  }

  async findOne(id: string, user: User): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOne({
      where: { id, list: { user: { id: user.id } } },
    });
    if (!listItem) {
      throw new NotFoundException(`ListItem with id ${id} not found`);
    }
    return listItem;
  }
}
