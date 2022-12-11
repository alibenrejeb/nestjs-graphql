import { HttpCode, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from './../../auths/guards/jwt-auth.guard';
import { CurrentUser } from './../../decorators/current-user.decorator';
import { JwtUser } from './../../models/user/jwt-user.model';
import { ArticleLikeOutput } from './../../models/article/like.model';

@Resolver(Article)
export class ArticleMutationsResolver {
  constructor(private readonly articleManager: ArticleManager) {}

  @Mutation(() => ArticleCreateOutput)
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async articleCreate(
    @CurrentUser() user: JwtUser,
    @Args('input') input: ArticleCreateInput,
  ) {
    return await this.articleManager.create(user, input);
  }

  @Mutation(() => ArticleUpdateOutput)
  @UseGuards(JwtAuthGuard)
  async articleUpdate(
    @Args({ name: 'articleId', type: () => ID })
    articleId: string,
    @Args('input') input: ArticleUpdateInput,
  ) {
    return await this.articleManager.update(articleId, input);
  }

  @Mutation(() => ArticleDeleteOutput)
  @UseGuards(JwtAuthGuard)
  async articleDelete(
    @Args({ name: 'articleId', type: () => ID })
    articleId: string,
  ) {
    return await this.articleManager.delete(articleId);
  }

  @Mutation(() => ArticleLikeOutput)
  @UseGuards(JwtAuthGuard)
  async like(
    @CurrentUser() user: JwtUser,
    @Args({ name: 'articleId', type: () => ID }) articleId: string,
    @Args({ name: 'like', type: () => Boolean }) like: boolean,
  ) {
    return await this.articleManager.like(user, articleId, like);
  }
}
