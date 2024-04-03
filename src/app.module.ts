import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './client/client.controller';
import { ClientService } from './client/client.service';
import { ClientModule } from './client/client.module';
import { PaymentModule } from './payment/payment.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), ClientModule, PaymentModule, InvoiceModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class AppModule {}
