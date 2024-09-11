import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { RefreshTokenWrapper } from './entities/refreshTokenWrapper.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenWrapper)
    private refreshTokenRepository: Repository<RefreshTokenWrapper>,
  ) {}
  /**
   * @todo implement rate limiting for login attempts from the same IP and email
   */
  async signIn(
    signInDto: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findUserByEmail(signInDto.email);

    if (!user) throw new NotFoundException('There is no user with this email');

    const isPasswordValid = await argon2.verify(
      user.password,
      signInDto.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('The password is not valid');

    const signOptions: JwtSignOptions = {
      issuer: process.env.JWT_ISSUER || 'maizum-back',
      audience: process.env.JWT_AUDIENCE || 'maizum-client',
      subject: user.id,
    };

    const access_token = this.jwtService.sign(
      {
        email: user.email,
      },
      signOptions,
    );

    const refresh_token = await this.saveRefreshToken(user.id);

    return { access_token, refresh_token };
  }

  async logout(refreshToken: string): Promise<void> {
    const refreshTokenWrapper = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
    });

    if (!refreshTokenWrapper)
      throw new NotFoundException('Refresh token not found');

    await this.refreshTokenRepository.update(refreshTokenWrapper.refreshToken, {
      refreshToken,
      isValid: false,
    });
  }

  private async saveRefreshToken(userId: string): Promise<string> {
    const savedRefreshToken = await this.refreshTokenRepository.save({
      isValid: true,
      userId,
    });

    return savedRefreshToken.refreshToken;
  }

  public async validateAccessToken(accessToken: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_SECRET,
    });

    return payload;
  }
}
