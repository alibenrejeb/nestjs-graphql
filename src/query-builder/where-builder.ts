import { isEmpty, map } from 'lodash';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Filter, FiltersExpression, Operation } from './filters-expression';

type ParamValue = string | number | Array<string | number>;

export class WhereBuilder<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private filtersExpression?: FiltersExpression,
  ) {}

  build() {
    if (!this.filtersExpression) {
      return;
    }
    const whereSql = this.buildExpression(this.filtersExpression);
    this.qb.where(whereSql, this.params);
  }

  private buildExpression(filtersExpression: FiltersExpression): string {
    const filters = map(filtersExpression.filters, (f) => this.buildFilter(f));
    const join = map(filtersExpression.joinExpressions, (child) =>
      this.buildExpression(child),
    );

    const allSqlBlocks = [...filters, ...join];
    const sqLExpr = allSqlBlocks.join(` ${filtersExpression.operator} `);
    return isEmpty(sqLExpr) ? '' : `(${sqLExpr})`;
  }

  private buildFilter(filter: Filter): string {
    const paramName = `${filter.field.replace('.', '_')}_${++this.paramsCount}`;

    switch (filter.op) {
      case Operation.EQ:
        this.params[paramName] = String(filter.values[0]);
        return `${filter.field} = :${paramName}`;
      case Operation.IN:
        this.params[paramName] = filter.values.map((v) => String(v));
        return `${filter.field} IN (:${paramName})`;
      case Operation.LIKE:
        this.params[paramName] = `%${filter.values[0]}%`;
        return `${filter.field} LIKE :${paramName}`;
      case Operation.GE:
        this.params[paramName] = String(filter.values[0]);
        return `${filter.field} >= :${paramName}`;
      default:
        throw new Error(`Unknown filter operation: ${filter.op}`);
    }
  }
}
