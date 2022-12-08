import { Args, Query, Resolver } from '@nestjs/graphql';
import { ArticleManager } from '../../entity-managers/article.manager';
import { Article } from '../../entities/article.entity';
import {
  ArticlesPaginator,
  ArticlesPaginatorArgs,
} from '../../paginator/article.paginator';

@Resolver(Article)
export class ArticleQueriesResolver {
  constructor(private readonly articleManager: ArticleManager) {}

  @Query(() => ArticlesPaginator)
  async articles(
    @Args() args: ArticlesPaginatorArgs,
  ): Promise<ArticlesPaginator> {
    return await this.articleManager.articles(args);
  }
}
