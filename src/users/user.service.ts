import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
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

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      const userSaved = await this.userRepository.save(user);

      return userSaved;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while saving the user',
        error,
      );
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const originalUser = await this.findUserById(id);

    await this.userRepository.update(id, userData);
    return this.userRepository.create({ ...originalUser, ...userData });
  }
}
