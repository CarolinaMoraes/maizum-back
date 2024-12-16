import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/users/user.service';
import { AuthService } from '../auth.service';
import { JwtCustomPayload } from '../interfaces/jwtCustomPayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isPublic) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) throw new UnauthorizedException('No Bearer token provided');

      try {
        const payload: JwtCustomPayload =
          await this.authService.validateAccessToken(token);

        request['user'] = await this.userService.findUserById(payload.sub);
      } catch (error) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
