import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDTO {
  @IsNotEmpty()
  @IsString()
  password: string;
}
