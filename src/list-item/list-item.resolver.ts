import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';
import { FindAllListItemsArgs } from './dto/args/find-all-list-items.args';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput, user);
  }

  @Query(() => [ListItem], { name: 'listItems' })
  findAll(
    @Args() findAllListItemsArgs: FindAllListItemsArgs,
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(
      findAllListItemsArgs.listId,
      findAllListItemsArgs,
    );
  }

  @Query(() => ListItem, { name: 'listItem' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id, user);
  }

  @Mutation(() => ListItem)
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.update(
      updateListItemInput.id,
      updateListItemInput,
      user,
    );
  }
}
