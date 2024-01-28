import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthResponseDto {
  @ApiProperty({ description: '액세스 토큰', example: 'JWTaccessToken' })
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰', example: 'JWTrefreshToken' })
  refreshToken: string;

  @ApiProperty({ description: '기가입, 최초가입자 여부', example: 'true' })
  isEnrolled: boolean;
}
