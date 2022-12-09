import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ChangePasswordInput } from './../models/user/change-password.model';
import {
  UserCreateInput,
  UserCreateOutput,
} from './../models/user/create.model';
import { JwtUser } from './../models/user/jwt-user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserManager {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(input: UserCreateInput): Promise<UserCreateOutput> {
    input.password = bcrypt.hashSync(input.password);
    const user = await this.userRepository.create(input).save();
    return { user };
  }

  async findOne(email: string): Promise<User> {
    const user = this.userRepository.findOneOrFail({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ${email} not found`);
    }

    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async changePassword(currentUser: JwtUser, input: ChangePasswordInput) {
    console.log(JSON.stringify(currentUser));
    const user = await this.findOneById(currentUser.sub);
    const validate = bcrypt.compareSync(input.actualPassword, user.password);

    if (!validate) {
      throw new BadRequestException(
        'The password entered is not the same as your password',
      );
    }

    user.password = bcrypt.hashSync(input.newPassword);
    user.changedPassword = new Date();
    await user.save();

    return { message: 'Password changed !' };
  }
}
