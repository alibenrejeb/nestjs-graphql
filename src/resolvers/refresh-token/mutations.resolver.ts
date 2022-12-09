import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './../../services/auth.service';
import { RefreshToken } from './../../entities/refresh-token.entity';
import {
  AuthTokenOutput,
  AuthTokenInput,
} from './../../models/auth/token.model';
import {
  ChangePasswordOutput,
  ChangePasswordInput,
} from './../../models/user/change-password.model';
import { UserManager } from './../../entity-managers/user.manager';
import { JwtAuthGuard } from './../../auths/guards/jwt-auth.guard';
import { CurrentUser } from './../../decorators/current-user.decorator';
import { JwtUser } from './../../models/user/jwt-user.model';

@Resolver()
export class RefreshTokenMutationsResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userManager: UserManager,
  ) {}

  @Mutation(() => AuthTokenOutput)
  async refreshedAccesToken(@Args('input') input: AuthTokenInput) {
    return await this.authService.generate(input);
  }

  @Mutation(() => ChangePasswordOutput)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Args('input', new ValidationPipe({ groups: ['change_password'] }))
    input: ChangePasswordInput,
  ) {
    return await this.userManager.changePassword(user, input);
  }
}
