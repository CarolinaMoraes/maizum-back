import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Post('/logout')
  async logout(@Req() req: Request): Promise<void> {
    await this.authService.logout(req.cookies['refresh_token']);
  }
}
