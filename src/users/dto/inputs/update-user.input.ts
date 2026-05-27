import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(SignupInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsIn(Object.values(ValidRoles), { each: true })
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
