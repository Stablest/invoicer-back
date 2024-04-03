import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';
import { RefreshTokenAuthGuard } from './guards';
import { Cookies } from './decorators';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDTO: SignInDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.signIn(signInDTO);
    res.cookie('jwt_rt', refreshToken).cookie('jwt_at', accessToken);
    return { accessToken };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDTO: SignUpDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.signUp(signUpDTO);
    res.cookie('jwt_rt', refreshToken).cookie('jwt_at', accessToken);
    return { accessToken };
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh')
  async refresh(@Cookies('jwt_rt') refreshToken: string) {
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { accessToken };
  }
}
