import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateSceneRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  video: Express.Multer.File;

  @ApiProperty({ description: '제목', example: '고향집' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '장소',
    enum: ['indoor', 'outdoor', 'unbound'],
  })
  @IsString()
  @IsNotEmpty()
  location: 'indoor' | 'outdoor' | 'unbound';
}
