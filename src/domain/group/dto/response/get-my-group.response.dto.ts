import { ApiProperty, PickType } from '@nestjs/swagger';
import { Group } from '../../entity/group.entity';
import { User } from 'src/domain/user/entity/user.entity';

class UserDto extends PickType(User, ['email', 'name'] as const) {
  static of(user: User): UserDto {
    return {
      email: user.email,
      name: user.name,
    };
  }
}

export class GetMyGroupReponseDto {
  @ApiProperty({ description: '환자 정보', type: () => UserDto })
  recipient: UserDto;

  @ApiProperty({ description: '보호자 목록', type: () => [UserDto] })
  givers: UserDto[];

  static of(group: Group): GetMyGroupReponseDto {
    const { recipient, givers } = group;
    return {
      recipient: UserDto.of(recipient),
      givers: givers.map((giver) => UserDto.of(giver)),
    };
  }
}
