import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  UserCreateInput,
  UserCreateOutput,
} from './../models/user/create.model';
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
    return this.userRepository.findOneOrFail({
      where: {
        email,
      },
    });
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
