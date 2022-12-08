import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from './../entities/comment.entity';
import { Paginator } from './paginator';

@ObjectType()
export class ArticleCommentsPaginator extends Paginator {
  @Field(() => [Comment])
  results: Comment[];
}
