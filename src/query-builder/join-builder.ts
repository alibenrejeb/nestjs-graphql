import { forEach } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';
import { FiltersExpression } from './filters-expression';

export class JoinBuilder<Entity> {
  private joinedEntities = new Set<string>();

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private filtersExpression?: FiltersExpression,
  ) {}

  build() {
    if (!this.filtersExpression.joinExpressions) {
      return;
    }

    forEach(this.filtersExpression.joinExpressions, (child) =>
      this.addJoinEntity(child.filters),
    );
  }

  private addJoinEntity(filters) {
    for (const { field, relation } of filters) {
      const entityName = field.split('.')[0];

      if (relation && !this.joinedEntities.has(entityName)) {
        this.qb.leftJoinAndSelect(relation, entityName);
        this.joinedEntities.add(entityName);
      }
    }
  }
}
