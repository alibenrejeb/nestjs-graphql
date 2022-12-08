import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenOutput {
  @Field(() => String)
  accessToken: string;
}

@InputType()
export class AuthTokenInput {
  @Field(() => String)
  refreshToken: string;
}
