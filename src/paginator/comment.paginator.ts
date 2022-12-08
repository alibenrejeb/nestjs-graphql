import { Field, ObjectType } from '@nestjs/graphql';
import { Paginator } from './paginator';
import { Comment } from '../entities/comment.entity';

@ObjectType()
export class CommentsPaginator extends Paginator {
  @Field(() => [Comment])
  results: Comment[];
}
