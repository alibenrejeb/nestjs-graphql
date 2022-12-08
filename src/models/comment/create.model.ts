import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { Comment } from './../../entities/comment.entity';

@InputType()
export class CommentCreateInput {
  @Field(() => String)
  message: string;

  @Field(() => String)
  articleId: string;
}

@ObjectType()
export class CommentCreateOutput {
  @Field(() => Comment)
  comment: Comment;
}
