import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { Article } from '../../entities/article.entity';
import { ArticleManager } from '../../entity-managers/article.manager';
import { ArticleDeleteOutput } from '../../models/article/delete.model';
import {
  ArticleCreateInput,
  ArticleCreateOutput,
} from './../../models/article/create.model';
import {
  ArticleUpdateOutput,
  ArticleUpdateInput,
} from '../../models/article/update.model';

@Resolver(Article)
export class ArticleMutationsResolver {
  constructor(private readonly articleManager: ArticleManager) {}

  @Mutation(() => ArticleCreateOutput)
  async articleCreate(@Args('input') input: ArticleCreateInput) {
    return await this.articleManager.create(input);
  }

  @Mutation(() => ArticleUpdateOutput)
  async articleUpdate(
    @Args({ name: 'articleId', type: () => ID })
    articleId: string,
    @Args('input') input: ArticleUpdateInput,
  ) {
    return await this.articleManager.update(articleId, input);
  }

  @Mutation(() => ArticleDeleteOutput)
  async articleDelete(
    @Args({ name: 'articleId', type: () => ID })
    articleId: string,
  ) {
    return await this.articleManager.delete(articleId);
  }
}
