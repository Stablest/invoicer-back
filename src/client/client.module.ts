import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [UserModule, PrismaModule],
})
export class ClientModule {}
