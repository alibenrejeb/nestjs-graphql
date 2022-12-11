import { Entity, Column, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
@ObjectType()
export class Comment extends AbstractEntity {
  @Field(() => String)
  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @RelationId((self: Comment) => self.author)
  readonly authorId: string;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @RelationId((self: Comment) => self.article)
  readonly articleId: string;
}
