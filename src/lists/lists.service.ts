import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({
      ...createListInput,
      user,
    });

    return await this.listRepository.save(newList);
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<List[]> {
    const { limit = 10, offset = 0, search } = paginationArgs;

    return await this.listRepository.find({
      skip: offset,
      take: limit,
      where: {
        user: { id: user.id },
        ...(search && { name: ILike(`%${search}%`) }),
      },
    });
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listRepository.preload({
      ...updateListInput,
      id,
    });

    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }

    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);

    return { ...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
