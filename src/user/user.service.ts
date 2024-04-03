import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(args: Prisma.UserCreateArgs) {
    const user = await this.prismaService.user.create(args);
    if (!user) {
      throw new UnprocessableEntityException('User cannot be created.');
    }
    return user;
  }

  async getAllUsers(args?: Prisma.UserFindManyArgs) {
    const users = await this.prismaService.user.findMany(args);
    if (users.length === 0) {
      throw new NotFoundException('Users not found.');
    }
    return users;
  }

  async getUser(args?: Prisma.UserFindUniqueOrThrowArgs) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: args.where,
      select: args.select,
    });
  }

  async updateUser(args: Prisma.UserUpdateArgs) {
    const updatedUser = await this.prismaService.user.update(args);
    if (!updatedUser) {
      throw new UnprocessableEntityException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(args: Prisma.UserDeleteArgs) {
    const deletedUser = await this.prismaService.user.delete(args);
    if (!deletedUser) {
      throw new NotFoundException('User not found.');
    }
  }
}
