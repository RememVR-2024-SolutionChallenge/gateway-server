import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueueAiTaskRequestDto {
  @ApiProperty({ description: '배경(scene), 아바타(avatar)' })
  @IsString()
  @IsNotEmpty()
  type: 'scene' | 'avatar';

  @ApiProperty({ description: '3DGS에서 사용할 비디오' })
  @IsString()
  @IsNotEmpty()
  video: string;

  validateType() {
    if (this.type != 'scene' && this.type != 'avatar') {
      throw new BadRequestException('type must be scene or avatar');
    }
  }
}
