import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private config: ConfigService,
    private prismaService: PrismaService,
  ) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    const stripe = new Stripe(this.config.getOrThrow('STRIPE_SECRET_KEY'));
    const product = await stripe.products.create({
      name: 'Produto Teste 1',
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1000,
      currency: 'brl',
    });
    const customer = await stripe.customers.create({
      name: 'Name client 1',
      email: 'marlonlocci@hotmail.com',
      description: 'My first customer',
    });
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 30,
    });
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      price: price.id,
      invoice: invoice.id,
    });
    const finalInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);
    console.log('final invoice ->', finalInvoice);
    console.log('sent invoice ->', sentInvoice);
    const client = await this.prismaService.client.update({
      where: { id: 'aeaf505d-10ee-427c-a1e8-6564f10229d4' },
      data: { stripeCustomerId: customer.id },
    });
    return sentInvoice;
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
