import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
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
import { Article } from '../entities/article.entity';
import { ArticleDeleteOutput } from '../models/article/delete.model';
import {
  ArticlesPaginator,
  ArticlesPaginatorArgs,
} from '../paginator/article.paginator';
import { User } from './../entities/user.entity';
import { Comment } from './../entities/comment.entity';
import { PaginatorArgs } from './../paginator/paginator';
import { FiltersExpression } from '../query-builder/filters-expression';
import { QueryBuilder } from '../query-builder/query-builder';
import { ArticleLikeOutput } from './../models/article/like.model';
import { UsersPaginator } from './../paginator/user.paginator';
import { ArticleFilterArgs } from './../filters/article.filter';

@Injectable()
export class ArticleManager {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async findAll(args: ArticleFilterArgs): Promise<ArticlesPaginator> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    for (const [key, value] of Object.entries(args.filters)) {
      queryBuilder.andWhere(`${key} LIKE :key`, {
        key: `%${args.filters[key]}%`,
      });
    }

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

  async getArticles(
    filters: FiltersExpression,
    args: ArticlesPaginatorArgs,
  ): Promise<ArticlesPaginator> {
    const queryBuilder = new QueryBuilder<Article>(
      this.articleRepository,
      filters,
      args,
    );
    const qb: SelectQueryBuilder<Article> = queryBuilder.build();

    const [results, total] = await qb.getManyAndCount();
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

  async getLikes(articleId: string): Promise<UsersPaginator> {
    const article = await this.articleRepository.findOne({
      relations: ['likes'],
      where: {
        id: articleId,
      },
    });

    return {
      results: article.likes,
      total: article.likes.length,
    };
  }

  async like(
    jwtUser: JwtUser,
    articleId: string,
    like: boolean,
  ): Promise<ArticleLikeOutput> {
    const article = await this.articleRepository.findOne({
      relations: ['likes'],
      where: {
        id: articleId,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article ${articleId} not found`);
    }

    const user = await this.userRepository.findOne({
      where: {
        id: jwtUser.sub,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${articleId} not found`);
    }

    const index = article.likes.findIndex((like) => like.id === user.id);

    if (like && index > -1) {
      throw new BadRequestException(
        `The article ${article.id} has already liked by ${user.id}`,
      );
    }

    if (!like && index === -1) {
      throw new BadRequestException(
        `The article ${article.id} is already disliked`,
      );
    }

    like ? article.like(user) : article.dislike(user);
    await article.save();

    return { article };
  }
}
