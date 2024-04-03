import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AccessTokenAuthGuard } from '../auth/guards';

@UseGuards(AccessTokenAuthGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Query('userId') userId: string, @Body() createClientDto: CreateClientDto) {
    return this.clientService.create({ data: { ...createClientDto, userId } });
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update({ where: { id }, data: updateClientDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove({ where: { id } });
  }
}
