import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(private config: ConfigService) {}

  async create() {
    console.log('key ->', this.config.getOrThrow('STRIPE_SECRET_KEY'));
    return 'ok';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
