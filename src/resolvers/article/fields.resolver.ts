import { UsersPaginator } from './../../paginator/user.paginator';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginatorArgs } from './../../paginator/paginator';
import { Article } from './../../entities/article.entity';
import { User } from './../../entities/user.entity';
import { UserManager } from './../../entity-managers/user.manager';
import { ArticleManager } from './../../entity-managers/article.manager';
import { CommentsPaginator } from './../../paginator/comment.paginator';

@Resolver(Article)
export class ArticleFieldsResolver {
  constructor(
    private readonly userManager: UserManager,
    private readonly articleManager: ArticleManager,
  ) {}

  @ResolveField(() => User, { nullable: true })
  async author(@Parent() article: Article) {
    if (!article.authorId) {
      return null;
    }

    try {
      return await this.userManager.findOneById(article.authorId);
    } catch (error) {
      return null;
    }
  }

  @ResolveField(() => CommentsPaginator)
  async comments(
    @Parent() article: Article,
    @Args() args: PaginatorArgs,
  ): Promise<CommentsPaginator> {
    return await this.articleManager.getComments(article.id, args);
  }

  @ResolveField(() => UsersPaginator)
  async likes(@Parent() article: Article): Promise<UsersPaginator> {
    return await this.articleManager.getLikes(article.id);
  }
}
