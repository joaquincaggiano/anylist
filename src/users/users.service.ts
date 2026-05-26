import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayOverlap, Repository } from 'typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    try {
      if (roles.length === 0) return await this.userRepository.find();

      return await this.userRepository.find({
        where: {
          roles: ArrayOverlap(roles),
        },
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with id ${id} not found`,
      });
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with email ${email} not found`,
      });
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.findOneById(id);
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

    if (error.code === 'error-001') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
