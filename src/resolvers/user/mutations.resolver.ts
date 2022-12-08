import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  UserCreateOutput,
  UserCreateInput,
} from './../../models/user/create.model';
import { User } from './../../entities/user.entity';
import { UserManager } from './../../entity-managers/user.manager';

@Resolver(User)
export class UserMutationsResolver {
  constructor(private readonly userManager: UserManager) {}

  @Mutation(() => UserCreateOutput)
  async userCreate(@Args('input') input: UserCreateInput) {
    return await this.userManager.create(input);
  }
}
