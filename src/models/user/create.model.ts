import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { User } from './../../entities/user.entity';

@InputType()
export class UserCreateInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstname: string;

  @Field(() => String)
  lastname: string;

  @Field(() => String, { nullable: true })
  avatar: string;
}

@ObjectType()
export class UserCreateOutput {
  @Field(() => User)
  user: User;
}
