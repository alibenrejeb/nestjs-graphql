import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './../entities/user.entity';
import { UserManager } from '../entity-managers/user.manager';

@Injectable()
export class AuthService {
  constructor(
    private userManager: UserManager,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userManager.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      }),
    };
  }
}
