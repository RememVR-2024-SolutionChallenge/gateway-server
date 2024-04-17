import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GenerateSceneRequestDto } from 'src/domain/vr-resource/dto/request/generate-scene.request.dto';

export class SampleGetVrResourcesRequestDto {
  @ApiProperty({ description: 'admin임을 인증하는 키', example: 'key' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
