import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrResource } from '../../entity/vr-resource.entity';

class VrResourceDto extends PickType(VrResource, [
  'title',
  'filePath',
  'type',
  'createdAt',
] as const) {
  static of(vrResource: VrResource): VrResourceDto {
    return {
      title: vrResource.title,
      filePath: vrResource.filePath,
      type: vrResource.type,
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

  static of(vrResource: VrResource[]): GetVrResourcesResponseDto {
    const vrResourceDtos = vrResource.map((vrResource) =>
      VrResourceDto.of(vrResource),
    );
    return new GetVrResourcesResponseDto(vrResourceDtos);
  }
}
