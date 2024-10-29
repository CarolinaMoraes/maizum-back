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

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Get('/confirm-email')
  confirmRegistration(@Query('token') token: string): Promise<User> {
    try {
      const payload: { userId: string; iat: number; exp: number } =
        this.jwtService.verify(token);

      return this.userService.update(payload.userId, { confirmed: true });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
