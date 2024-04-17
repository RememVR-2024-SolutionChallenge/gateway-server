import { ApiProperty, PickType } from '@nestjs/swagger';
import { SampleVrResource } from '../../entity/sample-vr-resource.entity';

export class SampleVrResourceDto extends PickType(SampleVrResource, [
  'id',
  'title',
  'type',
  'createdAt',
] as const) {
  @ApiProperty({
    description: '인증된 storage URL (10분 간 유효)',
    example: [
      'https://storage.googleapis.com/...',
      'https://storage.googleapis.com/...',
    ],
  })
  storageUrls: string[];

  static of(
    vrResource: SampleVrResource,
    storageUrls: string[],
  ): SampleVrResourceDto {
    return {
      id: vrResource.id,
      title: vrResource.title,
      type: vrResource.type,
      storageUrls: storageUrls,
      createdAt: vrResource.createdAt,
    };
  }
}

export class SampleGetVrResourcesResponseDto {
  @ApiProperty({
    description: 'VR 자원(아바타, 배경) 목록',
    type: [SampleVrResourceDto],
  })
  vrResources: SampleVrResourceDto[];

  constructor(vrResources: SampleVrResourceDto[]) {
    this.vrResources = vrResources;
  }
}
