import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PaginatorArgs } from 'src/paginator/paginator';

export class PaginatorBuilder<Entity> {
  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private paginatorArgs?: PaginatorArgs,
  ) {}

  build() {
    if (this.paginatorArgs) {
      this.qb.take(this.paginatorArgs.take).skip(this.paginatorArgs.skip);
    }
  }
}
