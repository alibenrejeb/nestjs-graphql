import { Field, ObjectType } from '@nestjs/graphql';
import { AuthTokenOutput } from './token.model';

@ObjectType()
export class AuthLoginOutput extends AuthTokenOutput {
  @Field(() => String)
  refreshToken: string;
}
