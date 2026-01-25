import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  banReason: string;
  @IsOptional()
  @IsString()
  banExpiresIn?: string;
}
