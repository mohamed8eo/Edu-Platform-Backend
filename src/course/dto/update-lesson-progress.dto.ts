import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateLessonProgressDto {
  @ApiProperty({ description: 'Whether the lesson is completed.' })
  @IsBoolean()
  completed: boolean;
}
