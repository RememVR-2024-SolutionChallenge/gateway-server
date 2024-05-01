import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GenerateVrVideoRequestDto } from 'src/domain/vr-video/dto/request/generate-vr-video.request.dto';

export class SampleGenerateVideoRequestDto extends GenerateVrVideoRequestDto {
  @ApiProperty({ description: 'admin임을 인증하는 키', example: 'key' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
