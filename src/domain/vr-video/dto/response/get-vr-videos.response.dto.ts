import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrVideo } from '../../entity/vr-video.entity';
import { VrResourceDto } from 'src/domain/vr-resource/dto/response/get-vr-resources.response.dto';

export class GetVrVideosResponseDto extends PickType(VrVideo, [
  'title',
] as const) {
  @ApiProperty({ type: VrResourceDto })
  scene: VrResourceDto;

  @ApiProperty({ type: [VrResourceDto] })
  avatars: VrResourceDto[];

  constructor(
    vrVideo: VrVideo,
    scene: VrResourceDto,
    avatars: VrResourceDto[],
  ) {
    super(vrVideo, ['title', 'scene', 'avatars']);
    this.scene = scene;
    this.avatars = avatars;
  }
}
