import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateAvatarRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  video: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @ApiProperty({ description: '제목', example: '아들' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '성별',
    enum: ['female', 'male', 'neutral'],
  })
  @IsString()
  @IsNotEmpty()
  gender: 'female' | 'male' | 'neutral';
}
