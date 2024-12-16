import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserService } from 'src/users/user.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Get('/confirm-email')
  async confirmRegistration(@Query('token') token: string): Promise<User> {
    try {
      const payload: { userId: string; iat: number; exp: number } =
        this.jwtService.verify(token);

      const user = await this.userService.update(payload.userId, {
        confirmed: true,
      });

      // Use class-transform.plainToInstance() to make sure we are not returning any properties
      // annotated with @Exclude
      return plainToInstance(User, user);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.update(id, updateUserDto);

    // Use class-transform.plainToInstance() to make sure we are not returning any properties
    // annotated with @Exclude
    return plainToInstance(User, user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findUserById(id);

    // Use class-transform.plainToInstance() to make sure we are not returning any properties
    // annotated with @Exclude
    return plainToInstance(User, user);
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(createUserDto);

    // Use class-transform.plainToInstance() to make sure we are not returning any properties
    // annotated with @Exclude
    return plainToInstance(User, user);
  }
}
