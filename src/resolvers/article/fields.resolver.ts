import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Article } from './../../entities/article.entity';
import { User } from './../../entities/user.entity';
import { UserManager } from './../../entity-managers/user.manager';

@Resolver(Article)
export class ArticleFieldsResolver {
  constructor(private readonly userManager: UserManager) {}

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
}
