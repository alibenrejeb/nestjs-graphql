import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';
import { Comment } from './../entities/comment.entity';
import {
  CommentCreateInput,
  CommentCreateOutput,
} from './../models/comment/create.model';
import { ArticleManager } from './article.manager';
import { CommentsPaginator } from './../paginator/comment.paginator';
import { PaginatorArgs } from './../paginator/paginator';

@Injectable()
export class CommentManager {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleManager: ArticleManager,
  ) {}

  async create(
    user: any,
    input: CommentCreateInput,
  ): Promise<CommentCreateOutput> {
    const article = await this.articleManager.findOneById(input.articleId);
    const comment = this.commentRepository.create(input);
    comment.author = new User();
    comment.author.id = user.userId;
    comment.article = article;
    comment.message = input.message;
    await comment.save();
    return { comment };
  }

  // async update(
  //   articleId: string,
  //   input: ArticleUpdateInput,
  // ): Promise<ArticleUpdateOutput> {
  //   const article = await this.articleRepository.findOneOrFail({
  //     where: {
  //       id: articleId,
  //     },
  //   });

  //   article.title = input.title;
  //   article.description = input.description;
  //   article.image = input.image;
  //   await article.save();
  //   return { article };
  // }

  // async delete(articleId: string): Promise<ArticleDeleteOutput> {
  //   const article = await this.articleRepository.findOneOrFail({
  //     where: {
  //       id: articleId,
  //     },
  //   });

  //   await article.remove();
  //   return { articleId };
  // }

  async comments(args: PaginatorArgs): Promise<CommentsPaginator> {
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');
    queryBuilder.take(args.take).skip(args.skip);

    if (args.sortBy) {
      for (const [key, value] of Object.entries(args.sortBy)) {
        queryBuilder.addOrderBy(
          `comment.${key}`,
          args.sortBy[key] ? 'DESC' : 'ASC',
        );
      }
    }

    const [results, total] = await queryBuilder.getManyAndCount();

    return { results, total };
  }
}
