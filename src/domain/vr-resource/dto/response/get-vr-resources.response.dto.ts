import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrResource } from '../../entity/vr-resource.entity';

export class VrResourceDto extends PickType(VrResource, [
  'title',
  'type',
  'createdAt',
] as const) {
  @ApiProperty({
    description: 'storage URL',
    example: [
      'https://storage.googleapis.com/...',
      'https://storage.googleapis.com/...',
    ],
  })
  storageUrls: string[];

  static of(vrResource: VrResource, storageUrls: string[]): VrResourceDto {
    return {
      title: vrResource.title,
      type: vrResource.type,
      storageUrls: storageUrls,
      createdAt: vrResource.createdAt,
    };
  }
}

export class GetVrResourcesResponseDto {
  @ApiProperty({
    description: 'VR 자원(아바타, 배경) 목록',
    type: [VrResourceDto],
  })
  vrResources: VrResourceDto[];

  constructor(vrResources: VrResourceDto[]) {
    this.vrResources = vrResources;
  }
}
