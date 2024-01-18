import { BadRequestException } from '@nestjs/common';
import { ApiProduces, ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { User } from 'src/domain/user/data/entity/user.entity';

export class EnrollInfoRequestDto extends PickType(User, ['role']) {
  @ApiProperty({ enum: ['CareGiver', 'CareRecipient'] })
  @IsString()
  @IsNotEmpty()
  role!: 'CareGiver' | 'CareRecipient';

  validateRole() {
    if (this.role !== 'CareGiver' && this.role !== 'CareRecipient') {
      throw new BadRequestException('role must be CareGiver or CareRecipient');
    }
  }
}
