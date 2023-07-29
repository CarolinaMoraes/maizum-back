import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/createUserInput';
import { UpdateUserInput } from './dto/updateUserInput';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(userData: CreateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.create({ ...userData, lists: [] });
      const userSaved = await this.userRepository.save(user);

      return userSaved;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while saving the user',
        error,
      );
    }
  }

  async update(id: string, userData: UpdateUserInput): Promise<User> {
    const originalUser = await this.findUserById(id);

    await this.userRepository.update(id, userData);
    return this.userRepository.create({ ...originalUser, ...userData });
  }
}
