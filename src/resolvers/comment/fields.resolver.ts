import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Comment } from './../../entities/comment.entity';
import { User } from './../../entities/user.entity';
import { UserManager } from './../../entity-managers/user.manager';

@Resolver(Comment)
export class CommentFieldsResolver {
  constructor(private readonly userManager: UserManager) {}

  @ResolveField(() => User, { nullable: true })
  async author(@Parent() comment: Comment) {
    if (!comment.authorId) {
      return null;
    }

    try {
      return await this.userManager.findOneById(comment.authorId);
    } catch (error) {
      return null;
    }
  }
}
