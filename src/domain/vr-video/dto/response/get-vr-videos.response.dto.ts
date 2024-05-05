import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrVideo } from '../../entity/vr-video.entity';
import { VrResource } from 'src/domain/vr-resource/entity/vr-resource.entity';

export class VrResourceDtoForVideo extends PickType(VrResource, [
  'id',
  'title',
  'type',
  'createdAt',
  'isSample',
] as const) {
  // ! storageUrls: vr-resource(아바타) 파일
  @ApiProperty({
    description: 'vr-resource(아바타) 파일: storage URL (10분 간 유효)',
    example: [
      'https://storage.googleapis.com/...',
      'https://storage.googleapis.com/...',
    ],
  })
  storageUrls: string[];

  @ApiProperty({
    description: 'video내에서 리소스의 포지셔닝을 설명하는 파일의 storage URL',
    example: 'https://storage.googleapis.com/...',
  })
  inVideoPositionFile: string;

  static of(
    vrResource: VrResource,
    storageUrls: string[],
    inVideoPositionFile: string,
  ): VrResourceDtoForVideo {
    return {
      id: vrResource.id,
      title: vrResource.title,
      type: vrResource.type,
      storageUrls: storageUrls,
      inVideoPositionFile: inVideoPositionFile,
      createdAt: vrResource.createdAt,
      isSample: vrResource.isSample,
    };
  }
}

export class GetVrVideosResponseDto extends PickType(VrVideo, [
  'id',
  'title',
  'isSample',
] as const) {
  @ApiProperty({ type: VrResourceDtoForVideo })
  scene: VrResourceDtoForVideo;

  @ApiProperty({ type: [VrResourceDtoForVideo] })
  avatars: VrResourceDtoForVideo[];

  constructor(
    vrVideo: VrVideo,
    scene: VrResourceDtoForVideo,
    avatars: VrResourceDtoForVideo[],
  ) {
    super(vrVideo, ['title', 'scene', 'avatars']);
    this.id = vrVideo.id;
    this.title = vrVideo.title;
    this.isSample = vrVideo.isSample;
    this.scene = scene;
    this.avatars = avatars;
  }
}
