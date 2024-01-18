import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { User } from 'src/domain/user/data/entity/user.entity';

export class EnrollCareEmailRequestDto extends PickType(User, ['email']) {
  @ApiProperty({ description: '피보호자 계정의 이메일' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
