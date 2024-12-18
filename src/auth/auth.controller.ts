import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    const { access_token, refresh_token } = await this.authService.signIn(
      signInDto,
    );

    response.cookie('refresh_token', refresh_token, { httpOnly: true });
    return { access_token };
  }

  @Public()
  @Get('/confirm-email')
  async confirmRegistration(
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    try {
      const payload: { userId: string; iat: number; exp: number } =
        this.jwtService.verify(token);

      const user = await this.userService.update(payload.userId, {
        confirmed: true,
      });

      const { access_token, refresh_token } =
        await this.authService.signInSimplified(user.email);

      response.cookie('refresh_token', refresh_token, { httpOnly: true });
      return { access_token };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  @Post('/logout')
  async logout(@Req() req: Request): Promise<void> {
    await this.authService.logout(req.cookies['refresh_token']);
  }

  @Public()
  @Get('/refresh')
  async refreshAccessToken(
    @Req() req: Request,
  ): Promise<{ access_token: string }> {
    const access_token = await this.authService.refreshAccessToken(
      req.cookies['refresh_token'],
    );
    return { access_token };
  }
}
