import { InterfaceType } from '@nestjs/graphql';
import { Field, ID } from '@nestjs/graphql';
import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InterfaceType()
export abstract class AbstractEntity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    name: 'update_at',
  })
  updatedAt: Date;
}
