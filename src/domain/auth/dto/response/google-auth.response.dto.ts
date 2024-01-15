import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthResponseDto {
  @ApiProperty({ description: '액세스 토큰' })
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰' })
  refreshToken: string;

  @ApiProperty({ description: '기가입, 최초가입자 여부' })
  isEnrolled: boolean;
}
