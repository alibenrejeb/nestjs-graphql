import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';
import { EqualTo } from './../../decorators/equal-to.decorator';

export const REGEX_PASSWORD =
  /(?=.*[A-Z])(?=.*[a-z])(?=.*[@[\]^_!"#$%&'()*+,-./:;{}<>=|~?])[A-Za-z0-9@[\]^_!"#$%&'()*+,-./:;{}<>=|~?]{8,}$/;

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsNotEmpty({ groups: ['change_password'] })
  actualPassword: string;

  @Field(() => String)
  @Matches(REGEX_PASSWORD, {
    groups: ['change_password'],
    message:
      'newPassword must match eight characters minimum, at least one uppercase letter, one lowercase letter and one special character',
  })
  newPassword: string;

  @Field(() => String)
  @IsNotEmpty({ groups: ['change_password'] })
  @EqualTo('newPassword', { groups: ['change_password'] })
  repeatedNewPassword: string;
}

@ObjectType()
export class ChangePasswordOutput {
  @Field(() => String)
  message: string;
}
