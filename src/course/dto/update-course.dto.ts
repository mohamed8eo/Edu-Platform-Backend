import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  level?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  language?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  categoryIds: string[];
}
