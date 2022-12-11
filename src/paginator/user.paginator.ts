import { Field, ObjectType } from '@nestjs/graphql';
import { Paginator } from './paginator';
import { User } from '../entities/user.entity';

@ObjectType()
export class UsersPaginator extends Paginator {
  @Field(() => [User])
  results: User[];
}
