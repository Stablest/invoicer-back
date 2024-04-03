import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JWTPayload } from '../interfaces';
import { Request } from 'express';

@Injectable()
export class JWTATStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor(
    config: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JWTATStrategy.extractJWTFromCookie]),
      secretOrKey: config.get('JWT_AT_SECRET'),
    });
  }

  async validate(payload: JWTPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;
    delete user.passwordHash;
    return user;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.jwt_at?.length > 0) {
      return req.cookies.jwt_at;
    }
    return null;
  }
}
