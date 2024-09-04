import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as argon2 from 'argon2';

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
    const foundUser = await this.userRepository.findOneBy({
      email: userData.email,
    });

    if (foundUser) throw new ConflictException('User already exists');

    const hashedPassword: string = await argon2.hash(userData.password);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const userSaved = await this.userRepository.save(user);

    return userSaved;
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const originalUser = await this.findUserById(id);

    await this.userRepository.update(id, userData);
    return this.userRepository.create({ ...originalUser, ...userData });
  }
}
