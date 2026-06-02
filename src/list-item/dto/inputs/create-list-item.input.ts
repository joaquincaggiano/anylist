import { InputType, Int, Field, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Int, { defaultValue: 0, nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  itemId: string;
}
