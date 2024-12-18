import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserService } from 'src/users/user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
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
