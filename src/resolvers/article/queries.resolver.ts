import { Args, Query, Resolver } from '@nestjs/graphql';
import { ArticleManager } from '../../entity-managers/article.manager';
import { Article } from '../../entities/article.entity';
import {
  ArticlesPaginator,
  ArticlesPaginatorArgs,
} from '../../paginator/article.paginator';
import { FiltersExpression } from '../../query-builder/filters-expression';
import { ArticleOutput } from './../../models/article/articles.model';

@Resolver(Article)
export class ArticleQueriesResolver {
  constructor(private readonly articleManager: ArticleManager) {}

  @Query(() => ArticlesPaginator)
  async articles(
    @Args() args: ArticlesPaginatorArgs,
  ): Promise<ArticlesPaginator> {
    return await this.articleManager.findAll(args);
  }

  @Query(() => ArticlesPaginator)
  async getArticles(
    @Args('filters') filters: FiltersExpression,
    @Args() args: ArticlesPaginatorArgs,
  ): Promise<ArticlesPaginator> {
    return this.articleManager.getArticles(filters, args);
  }
}
