import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrResource } from '../../entity/vr-resource.entity';

export class VrResourceDto extends PickType(VrResource, [
  'id',
  'title',
  'type',
  'createdAt',
  'isSample',
] as const) {
  @ApiProperty({
    description:
      '인증된 storage URL (10분 간 유효), file이 여러 chunk로 나눠져있음.',
    example: [
      'https://storage.googleapis.com/...',
      'https://storage.googleapis.com/...',
    ],
  })
  storageUrls: string[];

  static of(vrResource: VrResource, storageUrls: string[]): VrResourceDto {
    return {
      id: vrResource.id,
      title: vrResource.title,
      type: vrResource.type,
      storageUrls: storageUrls,
      createdAt: vrResource.createdAt,
      isSample: vrResource.isSample,
    };
  }
}

export class GetVrResourceByIdResponseDto extends VrResourceDto {}

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
