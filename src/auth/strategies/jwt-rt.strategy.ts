import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import { JWTPayload } from '../interfaces';

@Injectable()
export class JWTRTStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JWTRTStrategy.extractJWT]),
      secretOrKey: config.get('JWT_RT_SECRET'),
    });
  }

  async validate(payload: JWTPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;
    delete user.passwordHash;
    return user;
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && req.cookies.jwt_rt?.length > 0) {
      return req.cookies.jwt_rt;
    }
    return null;
  }
}
