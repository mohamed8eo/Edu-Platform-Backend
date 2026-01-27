import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @ApiProperty()
  email: string;
  type: 'email-verification';
}

export class VerifyOtpDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(4, 8) // depends on your OTP length
  @ApiProperty()
  otp: string;

  type: 'email-verification';
}
