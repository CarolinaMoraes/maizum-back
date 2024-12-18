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
import { JwtCustomPayload } from './interfaces/jwtCustomPayload.interface';
import { isBefore } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenWrapper)
    private refreshTokenRepository: Repository<RefreshTokenWrapper>,
  ) {}

  private static defaultSignOptions: JwtSignOptions = {
    issuer: process.env.JWT_ISSUER || 'maizum-back',
    audience: process.env.JWT_AUDIENCE || 'maizum-client',
  };

  /**
   * @todo implement rate limiting for login attempts from the same user
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
      subject: user.id,
      ...AuthService.defaultSignOptions,
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

  async signInSimplified(
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException('There is no user with this email');

    const signOptions: JwtSignOptions = {
      subject: user.id,
      ...AuthService.defaultSignOptions,
    };

    const access_token = this.jwtService.sign(
      {
        email,
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
  /**
   * @todo implement rate limiting for access token refreshes from the same user
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const refreshTokenWrapper = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
    });

    if (
      !refreshTokenWrapper ||
      !refreshTokenWrapper.isValid ||
      isBefore(refreshTokenWrapper.expiresAt, new Date())
    )
      throw new UnauthorizedException();

    const signOptions: JwtSignOptions = {
      ...AuthService.defaultSignOptions,
      subject: refreshTokenWrapper.userId,
    };

    const user = await this.userService.findUserById(
      refreshTokenWrapper.userId,
    );

    if (!user)
      throw new UnauthorizedException(
        `User correspondent to token wasn't found`,
      );

    const access_token = this.jwtService.sign(
      {
        email: user.email,
      },
      signOptions,
    );

    return access_token;
  }

  private async saveRefreshToken(userId: string): Promise<string> {
    const savedRefreshToken = await this.refreshTokenRepository.save({
      isValid: true,
      userId,
    });

    return savedRefreshToken.refreshToken;
  }

  async validateAccessToken(accessToken: string): Promise<JwtCustomPayload> {
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_SECRET,
    });

    return payload;
  }
}
