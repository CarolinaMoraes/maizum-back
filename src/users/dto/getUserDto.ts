import { OmitType } from '@nestjs/mapped-types';
import { User } from '../user.entity';
export class getUserDto extends OmitType(User, ['password']) {}
