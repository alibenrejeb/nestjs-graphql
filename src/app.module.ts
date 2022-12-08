import { PassportModule } from '@nestjs/passport';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ArticleManager } from './entity-managers/article.manager';
import { Article } from './entities/article.entity';
import { User } from './entities/user.entity';
import { ArticleMutationsResolver } from './resolvers/article/mutations.resolver';
import { ArticleQueriesResolver } from './resolvers/article/queries.resolver';
import { UserMutationsResolver } from './resolvers/user/mutations.resolver';
import { UserManager } from './entity-managers/user.manager';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './auths/strategies/local.strategy';
import { AuthMutationsResolver } from './resolvers/auth/mutations.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, PassportModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Article, User]),
  ],
  controllers: [],
  providers: [
    ArticleManager,
    ArticleMutationsResolver,
    ArticleQueriesResolver,
    UserManager,
    UserMutationsResolver,
    AuthService,
    LocalStrategy,
    AuthMutationsResolver
  ],
})
export class AppModule {}