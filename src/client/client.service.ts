import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prismaService: PrismaService) {}
  async create(args: Prisma.ClientCreateArgs) {
    const client = await this.prismaService.client.create(args);
    if (!client) {
      throw new UnprocessableEntityException('Client cannot be created.');
    }
    return client;
  }

  async findAll(args?: Prisma.ClientFindManyArgs) {
    const clients = await this.prismaService.client.findMany(args);
    if (clients.length === 0) {
      throw new BadRequestException('Clients not found.');
    }
    return clients;
  }

  async findOne(args: Prisma.ClientFindUniqueOrThrowArgs) {
    return await this.prismaService.client.findUniqueOrThrow(args);
  }

  async update(args: Prisma.ClientUpdateArgs) {
    const client = await this.prismaService.client.update(args);
    if (!client) {
      throw new BadRequestException('Client not found.');
    }
    return client;
  }

  async remove(args: Prisma.ClientDeleteArgs) {
    const client = await this.prismaService.client.delete(args);
    if (!client) {
      throw new BadRequestException('Client not found.');
    }
    return client;
  }
}
