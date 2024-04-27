import { ApiProperty, PickType } from '@nestjs/swagger';
import { VrVideo } from '../../entity/vr-video.entity';
import { ObjectDataType } from '../../type/object-data.type';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VrResourceInfo {
  @ApiProperty({
    description: '리소스(아바타, 배경) ID',
    example: '123456789012',
  })
  @IsNotEmpty()
  @IsString()
  resourceId: string;

  @ApiProperty({ description: '리소스 위치 (VR 비디오 내에서의 x,y,z위치 등)' })
  @IsNotEmpty()
  objectData: ObjectDataType;
}

export class GenerateVrVideoRequestDto extends PickType(VrVideo, [
  'title',
] as const) {
  @ApiProperty({ description: 'VR 비디오에 사용할 배경의 정보' })
  @IsNotEmpty()
  sceneInfo: VrResourceInfo;

  @ApiProperty({
    description: 'VR 비디오에 사용할 아바타들의 정보',
    type: [VrResourceInfo],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => VrResourceInfo)
  avatarsInfo: VrResourceInfo[];
}
