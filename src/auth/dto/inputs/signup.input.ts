import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
