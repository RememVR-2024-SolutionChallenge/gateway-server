import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { User } from '../../data/entity/user.entity';

export class EnrollCareCertRequestDto extends PickType(User, ['email']) {
  @ApiProperty({
    description: '피보호자 연결을 위한 인증번호(이메일로 발송된)',
  })
  @IsString()
  @IsNotEmpty()
  certificate: string;

  @ApiProperty({ description: '피보호자 계정의 이메일' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
