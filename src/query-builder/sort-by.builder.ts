import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PaginatorArgs } from 'src/paginator/paginator';

export class SortByBuilder<Entity> {
  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private paginatorArgs?: PaginatorArgs,
  ) {}

  build() {
    if (this.paginatorArgs && this.paginatorArgs.sortBy) {
      for (const [key, value] of Object.entries(this.paginatorArgs.sortBy)) {
        this.qb.addOrderBy(`Article.${key}`, this.paginatorArgs.sortBy[key] ? 'DESC' : 'ASC');
      }
    }
  }
}
