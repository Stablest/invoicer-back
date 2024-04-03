import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JWTATStrategy } from '../auth/strategies';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, JWTATStrategy],
  imports: [AuthModule],
  exports: [UserService],
})
export class UserModule {}
