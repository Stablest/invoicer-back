import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    // private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.getUser({
      where: { email: signInDTO.email },
    });
    const passwordMatch = await argon.verify(user.passwordHash, signInDTO.password);
    if (!passwordMatch) throw new UnprocessableEntityException('Incorrect credentials');
    delete user.passwordHash;
    return this.signTokens(user.id);
  }

  async signUp(signUpDTO: SignUpDTO) {
    try {
      const passwordHash = await this.hashPassword(signUpDTO.password);
      delete signUpDTO.password;
      const newUser = await this.userService.createUser({
        data: { ...signUpDTO, passwordHash },
      });
      delete newUser.passwordHash;
      return this.signTokens(newUser.id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnprocessableEntityException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async hashPassword(password: string) {
    const passwordHash = await argon.hash(password);
    return passwordHash;
  }

  async signTokens(id: string) {
    const accessToken = await this.signAccessToken(id);
    const refreshToken = await this.signRefreshToken(id);
    return { accessToken, refreshToken };
  }

  async signAccessToken(id: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: id },
      { expiresIn: '1d', secret: this.config.get('JWT_AT_SECRET') },
    );
    return accessToken;
  }

  async signRefreshToken(id: string) {
    const refreshToken = await this.jwtService.signAsync(
      { sub: id },
      { expiresIn: '7d', secret: this.config.get('JWT_RT_SECRET') },
    );
    return refreshToken;
  }

  async refreshToken(refreshToken: string) {
    const isTokenValid = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_RT_SECRET'),
    });
    if (!isTokenValid) throw new UnauthorizedException();
    const decodedToken = this.jwtService.decode(refreshToken);
    if (typeof decodedToken === 'string') throw new BadRequestException('Malformed token');
    const { sub } = decodedToken;
    if (!sub) throw new BadRequestException('Malformed token');
    const accessToken = await this.signAccessToken(sub);
    return accessToken;
  }
}
