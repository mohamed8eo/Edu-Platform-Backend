import { ApiProperty } from '@nestjs/swagger';

export class TrafficLog {
  @ApiProperty()
  method: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  durationMs: number;
  @ApiProperty()
  ip?: string;
  @ApiProperty()
  userAgent?: string;
  @ApiProperty()
  userId?: string | null;
  @ApiProperty()
  timestamp: Date;
}
