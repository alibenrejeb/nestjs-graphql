import { InputType, ObjectType } from '@nestjs/graphql';
import {
  ArticleCreateInput,
  ArticleCreateOutput,
} from './../article/create.model';

@InputType()
export class ArticleUpdateInput extends ArticleCreateInput {}

@ObjectType()
export class ArticleUpdateOutput extends ArticleCreateOutput {}
