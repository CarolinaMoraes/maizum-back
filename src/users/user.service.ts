import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { sendEmail } from 'src/common/utils/mail.utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.confirmed) throw new UnauthorizedException();

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    if (!user.confirmed) throw new UnauthorizedException();

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
      confirmed: false,
      password: hashedPassword,
    });

    const userSaved = await this.userRepository.save(user);

    const confirmRegistrationToken = this.jwtService.sign(
      { userId: userSaved.id },
      { expiresIn: '1h' },
    );

    const confirmationLink = `${process.env.APP_URL}/confirmRegistration?=${confirmRegistrationToken}`;
    sendEmail(
      this.mailerService,
      userSaved.email,
      'Welcome to Maizum!',
      'confirmRegistration',
      {
        name: userSaved.firstname,
        confirmationLink,
      },
    );

    return userSaved;
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const originalUser = await this.findUserById(id);

    await this.userRepository.update(id, userData);
    return this.userRepository.create({
      ...originalUser,
      ...userData,
    });
  }
}
