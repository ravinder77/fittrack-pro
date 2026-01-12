import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_COOKIE = 'refresh_token';
const isProd = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });
  }



  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signup(body);
    this.setRefreshCookie(res, refreshToken);
    return {
      success: true,
      message: 'Sign up successfully',
      accessToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      body.email,
      body.password,
    );
    this.setRefreshCookie(res, refreshToken);
    return {
      success: true,
      message: 'Login successfully',
      accessToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, newRefreshToken);
    return {
      success: true,
      message: 'Token refreshed successfully',
      accessToken,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'] as string | undefined;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    this.clearRefreshCookie(res);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
