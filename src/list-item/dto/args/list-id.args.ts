import { Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ListIdArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  listId: string;
}
