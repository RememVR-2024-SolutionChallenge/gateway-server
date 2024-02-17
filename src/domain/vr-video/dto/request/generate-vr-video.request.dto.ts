import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrVideo } from '../../entity/vr-video.entity';
import { ObjectDataType } from '../../type/object-data.type';

class VrResourceInfo {
  @ApiProperty({ description: '리소스 ID', example: '123' })
  resourceId: string;

  @ApiProperty({ description: '리소스 위치 (VR 비디오 내에서의)' })
  objectData: ObjectDataType;
}

export class GenerateVrVideoRequestDto extends PickType(VrVideo, [
  'title',
] as const) {
  @ApiProperty({ description: 'VR 비디오에 사용할 배경의 정보' })
  sceneInfo: VrResourceInfo;

  @ApiProperty({
    description: 'VR 비디오에 사용할 아바타들의 정보',
    type: [VrResourceInfo],
  })
  avatarsInfo: VrResourceInfo[];
}
