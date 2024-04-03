import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTRTStrategy } from './strategies';
import { UserService } from '../user/user.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JWTRTStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}
