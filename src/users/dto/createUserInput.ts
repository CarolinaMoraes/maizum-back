import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  @IsNotEmpty()
  password: string;
}
