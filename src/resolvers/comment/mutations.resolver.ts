import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentManager } from './../../entity-managers/comment.manager';
import { Comment } from './../../entities/comment.entity';
import { JwtAuthGuard } from './../../auths/guards/jwt-auth.guard';
import { CurrentUser } from './../../decorators/current-user.decorator';
import {
  CommentCreateInput,
  CommentCreateOutput,
} from './../../models/comment/create.model';

@Resolver(Comment)
export class CommentMutationsResolver {
  constructor(private readonly commentManager: CommentManager) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentCreateOutput)
  async commentCreate(
    @CurrentUser() user: any,
    @Args('input') input: CommentCreateInput,
  ) {
    return await this.commentManager.create(user, input);
  }
}
