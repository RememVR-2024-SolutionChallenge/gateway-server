import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueueAiTaskRequestDto {
  @ApiProperty({ description: '배경(scene), 아바타(avatar)' })
  @IsString()
  @IsNotEmpty()
  type: 'scene' | 'avatar';

  @ApiProperty({ type: 'string', format: 'binary' })
  video: Express.Multer.File;

  validateType() {
    if (this.type != 'scene' && this.type != 'avatar') {
      throw new BadRequestException('type must be scene or avatar');
    }
  }
}
