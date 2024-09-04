import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
export class getUserDto extends OmitType(User, ['password']) {}
