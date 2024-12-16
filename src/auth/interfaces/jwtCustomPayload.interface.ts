import { JwtPayload } from 'jsonwebtoken/index';

export interface JwtCustomPayload extends JwtPayload {
  email: string;
}
