import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: '액세스 토큰을 재발급 할 때 사용될 리프레시 토큰',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
