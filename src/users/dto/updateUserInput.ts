import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUserInput';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['email', 'password']),
) {}
