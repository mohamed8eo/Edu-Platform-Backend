import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  banReason: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  banExpiresIn?: string;
}
