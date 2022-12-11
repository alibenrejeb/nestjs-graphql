import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
@ObjectType()
export class Article extends AbstractEntity {
  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @RelationId((self: Article) => self.author)
  readonly authorId: string;

  @OneToMany(() => Comment, (target) => target.article)
  comments: Comment[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_likes',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  likes: User[];

  /**
   * Like Article.
   *
   * @param {User} user
   *
   * @returns {Article}
   */
  public like(user: User): Article {
    if (!this.likes) {
      this.likes = [];
    }

    if (this.likes.indexOf(user) <= -1) {
      this.likes.push(user);
    }

    return this;
  }

  /**
   * Dislike article.
   *
   * @param {User} user
   *
   * @returns {Article}
   */
  public dislike(user: User): Article {
    const index = this.likes.findIndex((like) => like.id === user.id);

    if (index > -1) {
      this.likes.splice(index, 1);
    }

    return this;
  }
}
