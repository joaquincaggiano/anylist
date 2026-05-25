import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';

@InputType()
export class UpdateUserInput extends PartialType(SignupInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty()
  roles: string[];

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
