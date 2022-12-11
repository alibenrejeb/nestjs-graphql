import { ObjectType } from '@nestjs/graphql';
import { ArticleCreateOutput } from './create.model';

@ObjectType()
export class ArticleLikeOutput extends ArticleCreateOutput {}
