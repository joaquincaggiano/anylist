import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ValidRolesArgs } from './dto/args/roles.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'findUserById' })
  async findOneById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.USER, ValidRoles.SUPER_USER])
    user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Query(() => User, { name: 'findUserByEmail' })
  async findOneByEmail(
    @Args('email', { type: () => String }) email: string,
  ): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN])
    user: User,
  ): Promise<User> {
    return this.usersService.update({
      userId: updateUserInput.id,
      updateUserInput,
      userLogged: user,
    });
  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }
}
