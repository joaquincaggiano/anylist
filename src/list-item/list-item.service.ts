import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { User } from 'src/users/entities/user.entity';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from 'src/lists/entities/list.entity';
import { Item } from 'src/items/entities/item.entity';

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

  async findAll(listId: string): Promise<ListItem[]> {
    return await this.listItemRepository.find({
      where: { list: { id: listId } },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
