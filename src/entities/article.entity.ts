import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
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
  @JoinColumn()
  author: User;

  @RelationId((self: Article) => self.author)
  readonly authorId: string;

  @OneToMany(() => Comment, (target) => target.article)
  comments: Comment[];
}
