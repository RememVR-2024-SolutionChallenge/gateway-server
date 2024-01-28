import { PickType } from '@nestjs/swagger';
import { User } from 'src/domain/user/entity/user.entity';

export class GetMyProfileReponseDto extends PickType(User, [
  'email',
  'name',
  'role',
  'isEnrolled',
  'createdAt',
] as const) {
  static of(user: User): GetMyProfileReponseDto {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      isEnrolled: user.isEnrolled,
      createdAt: user.createdAt,
    };
  }
}
