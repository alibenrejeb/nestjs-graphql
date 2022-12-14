import { PassportModule } from '@nestjs/passport';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { ArticleManager } from './entity-managers/article.manager';
import { Article } from './entities/article.entity';
import { User } from './entities/user.entity';
import { Comment } from './entities/comment.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { ArticleMutationsResolver } from './resolvers/article/mutations.resolver';
import { ArticleQueriesResolver } from './resolvers/article/queries.resolver';
import { UserMutationsResolver } from './resolvers/user/mutations.resolver';
import { UserManager } from './entity-managers/user.manager';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './auths/strategies/local.strategy';
import { JwtStrategy } from './auths/strategies/jwt.strategy';
import { AuthMutationsResolver } from './resolvers/auth/mutations.resolver';
import { ArticleFieldsResolver } from './resolvers/article/fields.resolver';
import { CommentFieldsResolver } from './resolvers/comment/fields.resolver';
import { CommentManager } from './entity-managers/comment.manager';
import { CommentMutationsResolver } from './resolvers/comment/mutations.resolver';
import { CommentQueriesResolver } from './resolvers/comment/queries.resolver';
import { RefreshTokenManager } from './entity-managers/refresh-token.manager';
import { RefreshTokenMutationsResolver } from './resolvers/refresh-token/mutations.resolver';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
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
    TypeOrmModule.forFeature([Article, User, Comment, RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [],
  providers: [
    ArticleManager,
    ArticleMutationsResolver,
    ArticleQueriesResolver,
    UserManager,
    UserMutationsResolver,
    CommentManager,
    CommentMutationsResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthMutationsResolver,
    ArticleFieldsResolver,
    CommentFieldsResolver,
    CommentQueriesResolver,
    RefreshTokenManager,
    RefreshTokenMutationsResolver,
  ],
})
export class AppModule {}
