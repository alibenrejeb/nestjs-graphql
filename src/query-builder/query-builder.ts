import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { FiltersExpression } from './filters-expression';
import { JoinBuilder } from './join-builder';
import { WhereBuilder } from './where-builder';
import { PaginatorArgs } from './../paginator/paginator';
import { PaginatorBuilder } from './paginator.builder';
import { SortByBuilder } from './sort-by.builder';

export class QueryBuilder<Entity> {
  private readonly qb: SelectQueryBuilder<Entity>;

  constructor(
    entityRepository: Repository<Entity>,
    private filtersExpression?: FiltersExpression,
    private paginatorArgs?: PaginatorArgs,
  ) {
    this.qb = entityRepository.createQueryBuilder();
  }

  build() {
    const joinBuilder = new JoinBuilder<Entity>(
      this.qb,
      this.filtersExpression,
    );
    joinBuilder.build();

    const whereBuilder = new WhereBuilder<Entity>(
      this.qb,
      this.filtersExpression,
    );
    whereBuilder.build();

    const paginatorBuilder = new PaginatorBuilder<Entity>(
      this.qb,
      this.paginatorArgs,
    );
    paginatorBuilder.build();

    const sortByBuilder = new SortByBuilder<Entity>(
      this.qb,
      this.paginatorArgs,
    );
    sortByBuilder.build();

    return this.qb;
  }
}
