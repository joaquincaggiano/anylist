import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { ListIdArgs } from './list-id.args';

@ArgsType()
export class FindAllListItemsArgs extends IntersectionType(
  ListIdArgs,
  PaginationArgs,
) {}
