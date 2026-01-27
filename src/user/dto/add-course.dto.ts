import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCourseDto {
  @ApiProperty({ description: 'The UUID of the course to add' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
