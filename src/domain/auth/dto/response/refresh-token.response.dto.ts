import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({ description: '액세스 토큰', example: 'JWTaccessToken' })
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰', example: 'JWTrefreshToken' })
  refreshToken: string;
}
