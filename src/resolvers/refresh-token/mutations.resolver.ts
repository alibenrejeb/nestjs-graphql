import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './../../services/auth.service';
import { RefreshToken } from './../../entities/refresh-token.entity';
import { AuthTokenOutput, AuthTokenInput } from './../../models/auth/token.model';

@Resolver(RefreshToken)
export class RefreshTokenMutationsResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthTokenOutput)
  async refreshedAccesToken(
    @Args('input') input: AuthTokenInput,
  ) {
    return await this.authService.generate(input);
  }
}
