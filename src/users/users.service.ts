import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create(signupInput);
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error('Not implemented');
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.findOne(id);
      this.userRepository.merge(user, updateUserInput);
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string): Promise<User> {
    throw new Error('Not implemented');
  }

  private handleDBErrors(error: any): never {
    this.logger.error(error);

    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
