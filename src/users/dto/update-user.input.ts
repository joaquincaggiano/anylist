import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { ValidRoles } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(SignupInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsIn(Object.values(ValidRoles), { each: true })
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
