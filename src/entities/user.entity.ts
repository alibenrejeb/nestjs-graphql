import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from './abstract.entity';

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
}
