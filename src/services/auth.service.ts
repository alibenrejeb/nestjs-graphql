import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './../entities/user.entity';
import { UserManager } from './../entity-managers/user.manager';
import { RefreshTokenManager } from './../entity-managers/refresh-token.manager';
import { AuthTokenInput } from './../models/auth/token.model';

@Injectable()
export class AuthService {
  constructor(
    private userManager: UserManager,
    private jwtService: JwtService,
    private refreshTokenManager: RefreshTokenManager,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userManager.findOne(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const refreshToken = await this.refreshTokenManager.createOrFind({
      userId: user.id,
    });

    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      }),
      refreshToken,
    };
  }

  async generate(input: AuthTokenInput) {
    const refreshToken = await this.refreshTokenManager.findOneByToken(input.refreshToken);

    if (!refreshToken) {
      throw new NotFoundException()
    }

    const user = await this.userManager.findOneById(refreshToken.userId);

    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      })
    };

  }

}
