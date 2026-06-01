import { ArgsType } from '@nestjs/graphql';
import { IntersectionType } from '@nestjs/graphql';
import { ValidRolesArgs } from './roles.args';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@ArgsType()
export class FindUsersArgs extends IntersectionType(
  ValidRolesArgs,
  PaginationArgs,
) {}
