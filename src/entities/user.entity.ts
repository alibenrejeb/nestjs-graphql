import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from './abstract.entity';
import { Article } from './article.entity';
import { Comment } from './comment.entity';

@Entity()
@ObjectType()
export class User extends AbstractEntity {
  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => String)
  @Column()
  firstname: string;

  @Field(() => String)
  @Column()
  lastname: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'password_changed_at', nullable: true })
  passwordChangedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'last_logged_at', nullable: true })
  lastLoggedAt?: Date;

  @OneToMany(() => Article, (target) => target.author)
  articles: Article[];

  @OneToMany(() => Comment, (target) => target.author)
  comments: Comment[];
}
