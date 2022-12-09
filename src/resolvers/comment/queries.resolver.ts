import { Args, Query, Resolver } from '@nestjs/graphql';
import { CommentManager } from './../../entity-managers/comment.manager';
import { Comment } from './../../entities/comment.entity';
import { CommentsPaginator } from './../../paginator/comment.paginator';
import { PaginatorArgs } from './../../paginator/paginator';

@Resolver(Comment)
export class CommentQueriesResolver {
  constructor(private readonly commentManager: CommentManager) {}

  @Query(() => CommentsPaginator)
  async comments(@Args() args: PaginatorArgs): Promise<CommentsPaginator> {
    return await this.commentManager.findAll(args);
  }
}
