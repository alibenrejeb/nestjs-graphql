import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { RefreshToken } from './../../entities/refresh-token.entity';

@InputType()
export class RefreshTokenCreateInput {
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class RefreshTokenCreateOutput {
  @Field(() => RefreshToken)
  refreshToken: RefreshToken;
}

@ObjectType()
export class RefreshTokenValueOutput {
  @Field(() => String)
  refreshToken: string;
}
