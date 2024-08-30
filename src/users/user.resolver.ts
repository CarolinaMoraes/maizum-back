// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { User } from './user.entity';
// import { CreateUserInput } from './dto/createUserInput';
// import { UserService } from './user.service';
// import { UpdateUserInput } from './dto/updateUserInput';

// @Resolver('User')
// export class UserResolver {
//   constructor(private userService: UserService) {}

//   @Query(() => User)
//   async findUser(@Args('id') userId: string): Promise<User> {
//     return await this.userService.findUserById(userId);
//   }

//   @Query(() => User)
//   async findUserByEmail(@Args('email') email: string): Promise<User> {
//     return await this.userService.findUserByEmail(email);
//   }

//   @Mutation(() => User)
//   async createUser(@Args('userData') userData: CreateUserInput): Promise<User> {
//     return await this.userService.create(userData);
//   }

//   @Mutation(() => User)
//   async updateUser(
//     @Args('id') id: string,
//     @Args('userData') userData: UpdateUserInput,
//   ): Promise<User> {
//     return await this.userService.update(id, userData);
//   }
// }
