import { PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class EnrollRequestDto extends PickType(User, ['role']) {
  @IsString()
  @IsNotEmpty()
  role!: 'CareGiver' | 'CareRecipient';
}
