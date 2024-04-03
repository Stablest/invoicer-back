import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenAuthGuard } from '../auth/guards';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { Prisma, User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(AccessTokenAuthGuard)
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const select = {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    } satisfies Prisma.UserSelect;
    type MyUserPayLoad = Prisma.UserGetPayload<{ select: typeof select }>;
    const user: MyUserPayLoad = await this.userService.getUser({
      where: { id },
      select,
    });
    return user;
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post(':id')
  async updateUser(@Body() updateUserDTO: UpdateUserDTO, @Param('id') id: string) {
    return await this.userService.updateUser({
      where: { id },
      data: updateUserDTO,
    });
  }

  @UseGuards(AccessTokenAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.userService.deleteUser({
      where: { id },
    });
    return deletedUser;
  }

  @UseGuards(AccessTokenAuthGuard)
  @Patch('changePassword/:id')
  async updateUserPassword(@Body('password') password: string, @Param('id') id: string) {
    const passwordHash = await this.authService.hashPassword(password);
    const updatedUser = await this.userService.updateUser({
      where: { id },
      data: { passwordHash },
    });
    return updatedUser;
  }
}
