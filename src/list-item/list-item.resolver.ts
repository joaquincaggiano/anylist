import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateListItemInput } from './dto/inputs';
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

  @Query(() => [ListItem], { name: 'listItem' })
  findAll(
    @Args() findAllListItemsArgs: FindAllListItemsArgs,
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(
      findAllListItemsArgs.listId,
      findAllListItemsArgs,
    );
  }
}
