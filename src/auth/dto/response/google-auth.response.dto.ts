import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthResponseDto {
  @ApiProperty({ description: '액세스 토큰(최초가입자는 null)' })
  accessToken: String | null;

  @ApiProperty({ description: '리프레시 토큰(최초가입자는 null)' })
  refreshToken: String | null;
}
