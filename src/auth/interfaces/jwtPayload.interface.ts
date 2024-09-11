import { JwtSignOptions } from '@nestjs/jwt';

export interface JwtPayload extends JwtSignOptions {
  email: string;
}
