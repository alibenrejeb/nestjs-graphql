import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { Paginator, PaginatorArgs, PaginatorSortBy, SortBy } from './paginator';
import { Article } from '../entities/article.entity';

@InputType()
export class ArticlesPaginatorSortBy extends PaginatorSortBy {
  @Field(() => SortBy, { nullable: true })
  title?: SortBy;
}

@ArgsType()
export class ArticlesPaginatorArgs extends PaginatorArgs {
  @Field(() => ArticlesPaginatorSortBy, { nullable: true })
  sortBy?: ArticlesPaginatorSortBy;
}

@ObjectType()
export class ArticlesPaginator extends Paginator {
  @Field(() => [Article])
  results: Article[];
}
