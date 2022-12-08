import { UserManager } from './user.manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { RefreshToken } from './../entities/refresh-token.entity';
import {
  RefreshTokenCreateInput,
  RefreshTokenValueOutput,
} from './../models/refresh-token/create.model';
import { User } from './../entities/user.entity';

@Injectable()
export class RefreshTokenManager {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    private readonly userManager: UserManager,
  ) {}

  async findOneByToken(token: string): Promise<RefreshToken> {
    let refreshToken = await this.refreshRepository.findOne({
      where: {
        token,
      },
    });

    if (!refreshToken) {
      return null;
    }

    return refreshToken;
  }

  async createOrFind(input: RefreshTokenCreateInput): Promise<string> {
    let refreshToken = await this.refreshRepository.findOne({
      where: {
        user: {
          id: input.userId,
        },
      },
    });

    if (!refreshToken) {
      const user = await this.userManager.findOneById(input.userId);
      refreshToken = this.refreshRepository.create(input);
      refreshToken.user = new User();
      refreshToken.user.id = user.id;
      refreshToken.token = crypto
        .createHash('sha512')
        .update(user.id + new Date().getTime())
        .digest('hex');
      await refreshToken.save();
    }

    return refreshToken.token;
  }
}
