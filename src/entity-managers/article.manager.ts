import { JwtUser } from './../models/user/jwt-user.model';
import { CommentsPaginator } from './../paginator/comment.paginator';
import {
  ArticleUpdateInput,
  ArticleUpdateOutput,
} from '../models/article/update.model';
import {
  ArticleCreateInput,
  ArticleCreateOutput,
} from '../models/article/create.model';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const article = this.articleRepository.findOne({
      where: {
        id,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article ${id} not found`);
    }

    return article;
  }

  async create(
    user: JwtUser,
    input: ArticleCreateInput,
  ): Promise<ArticleCreateOutput> {
    const article = this.articleRepository.create(input);
    article.author = new User();
    article.author.id = user.sub;
    await article.save();
    return { article };
  }

  async update(
    articleId: string,
    input: ArticleUpdateInput,
  ): Promise<ArticleUpdateOutput> {
    const article = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article ${articleId} not found`);
    }

    article.title = input.title;
    article.description = input.description;
    article.image = input.image;
    await article.save();
    return { article };
  }

  async delete(articleId: string): Promise<ArticleDeleteOutput> {
    const article = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article ${articleId} not found`);
    }

    await article.remove();
    return { articleId };
  }

  async findAll(args: ArticlesPaginatorArgs): Promise<ArticlesPaginator> {
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

  async getComments(
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
