import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray, IsIn } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsIn(Object.values(ValidRoles), { each: true })
  roles: ValidRoles[] = [];
}
