import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EnrollCareCertRequestDto {
  @ApiProperty({
    description: '피보호자 연결을 위한 인증번호(이메일로 발송된)',
  })
  @IsString()
  @IsNotEmpty()
  certificate: string;
}
