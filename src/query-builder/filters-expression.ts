import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum Operator {
  AND = 'AND',
  OR = 'OR',
}

export enum Operation {
  EQ = 'EQ',
  IN = 'IN',
  LIKE = 'LIKE',
  GE = 'GE',
}

registerEnumType(Operator, {
  name: 'Operator',
});

registerEnumType(Operation, {
  name: 'Operation',
});

@InputType()
export class Filter {
  @Field(() => Operation)
  op: Operation;

  @Field(() => [String])
  values: [String];

  @Field(() => String)
  field: String;
}

@InputType()
export class FiltersExpression {
  @Field(() => Operator)
  operator: Operator;

  @Field(() => [Filter])
  filters: [Filter];

  @Field(() => [JoinExpressions], { nullable: true })
  joinExpressions?: [JoinExpressions];
}

@InputType()
export class JoinFilter extends Filter {
  @Field(() => String)
  relation: String;
}

@InputType()
export class JoinExpressions {
  @Field(() => [JoinFilter])
  filters: [JoinFilter];
}
