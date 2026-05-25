import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemRepository.create(createItemInput);
    return await this.itemRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.preload({
      ...updateItemInput,
      id,
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return await this.itemRepository.save(item);
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
