import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SampleGetVrVideosRequestDto {
  @ApiProperty({ description: 'admin임을 인증하는 키', example: 'key' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
