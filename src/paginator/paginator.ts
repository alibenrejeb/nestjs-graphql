import {
  ArgsType,
  Field,
  InputType,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';
import { AbstractEntity } from '../entities/abstract.entity';

export enum SortBy {
  ASC,
  DESC,
}

registerEnumType(SortBy, {
  name: 'SortBy',
});

@InputType()
export class PaginatorSortBy {
  @Field(() => SortBy, { nullable: true })
  createdAt?: SortBy;
}

@ArgsType()
export class PaginatorArgs {
  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}

@InterfaceType()
export abstract class Paginator<T extends AbstractEntity = AbstractEntity> {
  @Field()
  total: number;

  @Field(() => [AbstractEntity])
  abstract results: T[];
}
