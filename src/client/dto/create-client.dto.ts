import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}
