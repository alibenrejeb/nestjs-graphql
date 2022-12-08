import { CommentsPaginator } from './../paginator/comment.paginator';
import {
  ArticleUpdateInput,
  ArticleUpdateOutput,
} from '../models/article/update.model';
import {
  ArticleCreateInput,
  ArticleCreateOutput,
} from '../models/article/create.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { ArticleDeleteOutput } from '../models/article/delete.model';
import {
  ArticlesPaginator,
  ArticlesPaginatorArgs,
} from '../paginator/article.paginator';
import { User } from './../entities/user.entity';
import { Comment } from './../entities/comment.entity';
import { PaginatorArgs } from './../paginator/paginator';

@Injectable()
export class ArticleManager {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findOneById(id: string): Promise<Article> {
    return this.articleRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async create(
    user: any,
    input: ArticleCreateInput,
  ): Promise<ArticleCreateOutput> {
    const article = this.articleRepository.create(input);
    article.author = new User();
    article.author.id = user.userId;
    await article.save();
    return { article };
  }

  async update(
    articleId: string,
    input: ArticleUpdateInput,
  ): Promise<ArticleUpdateOutput> {
    const article = await this.articleRepository.findOneOrFail({
      where: {
        id: articleId,
      },
    });

    article.title = input.title;
    article.description = input.description;
    article.image = input.image;
    await article.save();
    return { article };
  }

  async delete(articleId: string): Promise<ArticleDeleteOutput> {
    const article = await this.articleRepository.findOneOrFail({
      where: {
        id: articleId,
      },
    });

    await article.remove();
    return { articleId };
  }

  async articles(args: ArticlesPaginatorArgs): Promise<ArticlesPaginator> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    queryBuilder.take(args.take).skip(args.skip);

    if (args.sortBy) {
      for (const [key, value] of Object.entries(args.sortBy)) {
        queryBuilder.addOrderBy(
          `article.${key}`,
          args.sortBy[key] ? 'DESC' : 'ASC',
        );
      }
    }

    const [results, total] = await queryBuilder.getManyAndCount();

    return { results, total };
  }

  async comments(
    articleId: string,
    args: PaginatorArgs,
  ): Promise<CommentsPaginator> {
    const [results, total] = await this.commentRepository.findAndCount({
      skip: args.skip,
      take: args.take,
      where: {
        article: {
          id: articleId,
        },
      },
      order: {
        createdAt: args.sortBy?.createdAt ? 'DESC' : 'ASC',
      },
    });

    return { results, total };
  }
}
