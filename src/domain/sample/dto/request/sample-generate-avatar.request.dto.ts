import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GenerateAvatarRequestDto } from 'src/domain/vr-resource/dto/request/generate-avatar.request.dto';

export class SampleGenerateAvatarRequestDto extends GenerateAvatarRequestDto {
  @ApiProperty({ description: 'admin임을 인증하는 키', example: 'key' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
