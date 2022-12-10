import { Field, ObjectType } from '@nestjs/graphql';
import { Article } from './../../entities/article.entity';

@ObjectType()
export class ArticleOutput {
  @Field(() => [Article])
  articles: Article[];
}
