import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { Article } from './../../entities/article.entity';

@InputType()
export class ArticleCreateInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  image: string;
}

@ObjectType()
export class ArticleCreateOutput {
  @Field(() => Article)
  article: Article;
}
