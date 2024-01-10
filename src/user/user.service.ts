import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async join(joinRequestDto) {
    return '가입';
  }
}
