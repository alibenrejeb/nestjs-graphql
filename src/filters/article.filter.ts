import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ArticlesPaginatorArgs } from './../paginator/article.paginator';

@InputType()
export class ArticleFilterInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ArgsType()
export class ArticleFilterArgs extends ArticlesPaginatorArgs {
  @Field(() => ArticleFilterInput, { nullable: true })
  filters: ArticleFilterInput;
}
